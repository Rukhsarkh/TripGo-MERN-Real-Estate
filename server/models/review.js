import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  rating: {
    type: Number,
    max: 5,
  },
});

const review = mongoose.model("review", reviewSchema);
export default review;
