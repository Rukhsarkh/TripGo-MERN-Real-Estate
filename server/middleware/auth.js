import Listing from "../models/listing.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  next();
};

export const isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.author.equals(req.user._id)) {
    return res
      .status(401)
      .json({ message: "You are not the owner of this Listing" });
  }
  next();
};
