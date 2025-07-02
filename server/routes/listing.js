import dotenv from "dotenv";
import express from "express";
const router = express.Router();
import Listing from "../models/listing.js";
import storage from "../CloudConfig.js";
import multer from "multer";
const upload = multer({ storage });
import { isLoggedIn, isOwner } from "../middleware/auth.js";
import mbxGeoCoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import mongoose from "mongoose";
const geoCodingClient = mbxGeoCoding({ accessToken: process.env.MAP_TOKEN });

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

router.get("/search", async (req, res) => {
  try {
    // For Pagination
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Handle type filter
    let type = req.query.type;
    if (!type || type === "all") {
      type = { $in: ["Rent", "Sale"] };
    }

    // Handle amenities filter - Fix boolean parsing
    let amenitiesQuery = {};
    const hasFurnished = req.query.furnished === "true";
    const hasParking = req.query.parking === "true";

    if (hasFurnished && hasParking) {
      amenitiesQuery.amenities = { $all: ["Furnished", "Parking"] };
    } else if (hasFurnished) {
      amenitiesQuery.amenities = { $in: ["Furnished"] };
    } else if (hasParking) {
      amenitiesQuery.amenities = { $in: ["Parking"] };
    }

    // Handle search terms
    const searchTerm = req.query.searchTerm || "";
    const country = req.query.country || "";

    // sorting logic
    const sortField = req.query.sort_order || "createdAt";
    const sortOrder = req.query.order || "asc";

    // Mapping frontend field names to database field names
    const fieldMapping = {
      regularPrice: "price",
      createdAt: "createdAt",
    };

    const actualSortField = fieldMapping[sortField] || sortField;

    // Convert order to MongoDB sort value (1 for asc, -1 for desc)
    const mongoSortOrder = sortOrder === "asc" ? 1 : -1;

    // console.log(
    //   `Sorting by: ${actualSortField}, Order: ${sortOrder} (${mongoSortOrder})`
    // );

    const listings = await Listing.find({
      title: { $regex: searchTerm, $options: "i" },
      type,
      country: { $regex: country, $options: "i" },
      ...amenitiesQuery,
    })
      .sort({ [actualSortField]: mongoSortOrder })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    // console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", isLoggedIn, upload.single("image"), async (req, res) => {
  // console.log(req.body);
  try {
    let response = await geoCodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();

    // console.log(response.body.features[0].geometry.coordinates);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newListing = new Listing({
      ...req.body,
      author: req.user._id,
      image: req.file
        ? {
            url: req.file.path,
            filename: req.file.filename,
          }
        : null,
      geometry: response.body.features[0].geometry,
    });

    const savedListing = await newListing.save();
    // console.log(savedListing);

    // Populate the author details after saving
    const populatedListing = await Listing.findById(savedListing._id).populate(
      "author",
      "username email"
    );

    res.status(201).json(populatedListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteList/:id", isLoggedIn, isOwner, async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
  }
});

router.get("/getUserListings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(typeof userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({
        success: false,
        message: "invaliduser ID",
        listings: [],
      });
    }

    const listings = await Listing.find({
      author: new mongoose.Types.ObjectId(userId),
    });

    // console.log(listings);

    // if (!listings || listings.length === 0) {
    //   return res.json({ success: false, message: "No Listing Created" });
    // } // do not send obj even if listings is empty

    //return obj and then check array.isArray
    return res.json({
      success: true,
      message: listings.length == 0 ? "Listings not Found" : "Listings fetched",
      listings,
    });
  } catch (error) {
    console.error("Error Fetching User Listings: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error Fetching Listings" });
  }
});

router.put(
  "/updateList/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { location } = req.body;

      // Ensure location is provided
      if (!location) {
        return res.status(400).json({ message: "Location is required" });
      }

      // Only update geometry if location has been changed
      // This code fetches the current listing with the given id
      const currentListing = await Listing.findById(id);

      // If the location has been changed, it fetches the new geometry from Mapbox Geocoding API
      if (currentListing.location !== location) {
        const response = await geoCodingClient
          .forwardGeocode({
            query: location, // The new location
            limit: 1, // Only one result is needed
          })
          .send();

        // If the response does not contain any features, it means the location is invalid
        if (!response.body.features.length) {
          return res.status(400).json({ message: "Invalid location" });
        }

        // Otherwise, it updates the geometry of the listing
        req.body.geometry = response.body.features[0].geometry;
      }

      const updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        {
          new: true,
        }
      );

      // Check if listing exists
      if (!updatedListing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      // Update image if file is provided
      if (req.file) {
        updatedListing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }

      await updatedListing.save();
      res.json(updatedListing);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/posts", async (_, res) => {
  try {
    const allListings = await Listing.find().populate(
      "author",
      "username email"
    );
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate(
      "author",
      "username email"
    );

    if (!listing) {
      return res
        .status(500)
        .json({ success: false, message: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error("Error fetching this listing", error);
  }
});

export default router;
