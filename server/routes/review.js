import express from "express";
import review from "../models/review.js";
import Listing from "../models/listing.js";
const router = express.Router({ mergeParams: true });
import { isLoggedIn } from "../middleware/auth.js";

router.post("/:listingId/create", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    const newReview = new review({
      ...req.body,
      author: req.user._id,
    });
    console.log(req.body);
    const savedReview = await newReview.save();
    listing.reviews.push(savedReview);
    await listing.save();
    const populatedReview = await Listing.findById(listing._id).populate({
      path: "reviews",
      populate: { path: "author", select: "username email" },
    });
    res.status(201).json(populatedReview);
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
      populate: { path: "author", select: "username email" },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete(
  "/:listingId/:reviewId/review-delete",
  isLoggedIn,
  async (req, res) => {
    try {
      const { listingId, reviewId } = req.params;

      await Listing.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId },
      });
      await review.findByIdAndDelete(reviewId);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
