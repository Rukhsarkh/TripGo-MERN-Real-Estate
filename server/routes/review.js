import express from "express";
import review from "../models/review.js";
import Listing from "../models/listing.js";
const router = express.Router({ mergeParams: true });

router.post("/:listingId/create", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    const newReview = new review(req.body);
    console.log(req.body);
    const savedReview = await newReview.save();
    listing.reviews.push(savedReview);
    await listing.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:listingId/allreviews", async (req, res) => {
  try {
    const { listingId } = req.params;

    // Find the listing and populate its reviews
    const listing = await Listing.findById(listingId).populate({
      path: "reviews",
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
