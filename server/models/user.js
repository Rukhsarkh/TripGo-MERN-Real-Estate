import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  password: {
    type: String,
    required: false,
  },
  verifyCode: {
    type: String,
    // required: [true, "Verification code is required"],
  },
  verifyCodeExpiration: {
    type: Date,
    // required: [true, "verify code expiy date is required"],
  },
  isVerified: {
    type: Boolean,
    default: true,
    // default: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

export default User;
