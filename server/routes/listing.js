import express from "express";
import Listing from "../models/listing.js";
const router = express.Router();
import multer from "multer";
import dotenv from "dotenv";
import storage from "../CloudConfig.js";
const upload = multer({ storage });

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body); //how the data in req.body will be saved according to model coz frontend has no reference of model and data is coming not according to the model fields but according to the form fields
    newListing.image = { url, filename };
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const allListings = await Listing.find();
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.json(listing);
  } catch (error) {
    console.error("Error fetching this listing", error);
  }
});

export default router;
