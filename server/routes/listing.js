import express from "express";
import Listing from "../models/listing.js";
const router = express.Router();
import multer from "multer";
import dotenv from "dotenv";
import storage from "../CloudConfig.js";
const upload = multer({ storage });
import { isLoggedIn, isOwner } from "../middleware/auth.js";

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

router.post("/create", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
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
    });

    const savedListing = await newListing.save();

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
