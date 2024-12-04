import express from "express";
import Listing from "../models/listing.js";
const router = express.Router();
import multer from "multer";
import dotenv from "dotenv";
import storage from "../CloudConfig.js";
const upload = multer({ storage });
import { isLoggedIn, isOwner } from "../middleware/auth.js";
import mbxGeoCoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const geoCodingClient = mbxGeoCoding({ accessToken: process.env.MAP_TOKEN });

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

router.post("/create", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
    let response = await geoCodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();

    console.log(response.body.features[0].geometry.coordinates);

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
    console.log(savedListing);

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
router.get("/posts", async (req, res) => {
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
