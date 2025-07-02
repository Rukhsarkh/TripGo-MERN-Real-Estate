import express from "express";
const router = express.Router();
import sendOTPEmail from "../helpers/sendOTPEmail.js";
import User from "../models/user.js";
import Listing from "../models/listing.js";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { isLoggedIn } from "../middleware/auth.js";
import mongoose from "mongoose";
import multer from "multer";
import storage from "../CloudConfig.js";
const upload = multer({ storage });

//test - route
router.get("/get-hello", (req, res) => {
  return res.json({ message: "hello" });
});

router.put(
  "/update-profile/:userId",
  isLoggedIn,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, newPassword } = req.body;
      const userObjId = new mongoose.Types.ObjectId(userId);

      // console.log(userObjId);
      // console.log(req.user._id);

      // Verify that the authenticated user is updating their own profile
      if (!userObjId.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own profile",
        });
      }

      // Find the user
      const user = await User.findById(userObjId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      //Backend field Validation
      // Validate required fields
      if (!username || !email) {
        return res.status(400).json({
          success: false,
          message: "Username and email are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Check if email is already taken by another user
      if (email !== user.email) {
        const existingUser = await User.findOne({
          email: email.toLowerCase(),
          _id: { $ne: userObjId },
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email is already registered to another account",
          });
        }
      }

      // Check if username is already taken by another user
      if (username !== user.username) {
        const existingUsername = await User.findOne({
          username: username,
          _id: { $ne: userObjId },
        });

        if (existingUsername) {
          return res.status(400).json({
            success: false,
            message: "Username is already taken",
          });
        }
      }

      // Handle password update if provided
      let updatedData = {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        updatedAt: new Date(),
      };

      if (newPassword) {
        // Validate new password length
        if (newPassword.length < 6) {
          return res.status(400).json({
            success: false,
            message: "New password must be at least 6 characters long",
          });
        }

        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        updatedData.password = hashedNewPassword;
      }

      if (req.file) {
        updatedData.avatar = req.file.path;
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(userObjId, updatedData, {
        new: true,
        runValidators: true,
      }).select("-password"); // Exclude password from response

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Failed to update user profile",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        avatar: updatedUser.avatar,
        user: {
          userId: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);

      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationErrors,
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is already taken`,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error while updating profile",
      });
    }
  }
);

router.delete("/deleteUser/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "invaliduser ID" });
    }

    const listings = await Listing.find({
      author: new mongoose.Types.ObjectId(userId),
    });

    // console.log(listings);
    await Listing.deleteMany({ author: new mongoose.Types.ObjectId(userId) });

    const userToBeDeleted = await User.findByIdAndDelete(
      new mongoose.Types.ObjectId(userId)
    );

    // console.log(userToBeDeleted);
    return res
      .status(200)
      .json({ success: true, message: "User Successfully Deleted" });
  } catch (error) {
    console.error("Error Deleting User", error);
    return res
      .status(500)
      .json({ sucess: false, message: "Error Deleting User" });
  }
});

router.get("/auth", (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.json({
        id: req.user.id,
        email: req.user.email,
        isAuthenticated: true,
        username: req.user.username,
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error("Auth route error:", error);
    res.status(500).json({
      isAuthenticated: false,
      error: "Internal server error",
    });
  }
});

router.post("/login", (req, res, next) => {
  // console.log("Login Route: ", req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ message: "Login successful", user: user.toJSON() });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // Clear the session cookie
      res.clearCookie("connect.sid");

      // Send response after cookie and session are cleared
      res.status(200).json({
        success: true,
        message: "You are logged out!",
      });
    });
  });
});

router.get("/get-profile", isLoggedIn, async (req, res) => {
  try {
    // console.log("****************************************");
    // console.log("Session:", req.session);
    // console.log("****************************************");
    // console.log("User object:", req.user);
    // console.log("****************************************");
    // console.log("Session user ID:", req.session.userID);
    // console.log("****************************************");

    // First try to get user from passport's req.user
    let userId = req.user?._id;

    // If not available, try session
    if (!userId && req.session.userID) {
      userId = req.session.userID;
    }

    if (!userId) {
      return res.status(401).json({
        message: "User isn't authenticated",
        session: req.session,
        user: req.user,
      });
    }

    const user = await User.findById(userId).select("username email avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      userId: user._id,
      isAuthenticated: true,
      avatar: user.avatar,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching profile, server Error !" });
  }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, // 5 requests per hour per IP
  message: {
    success: false,
    message: "Too many signup attempts. Please try again later.",
  },
});

//signup without email
router.post("/sign-up", signupLimiter, async (req, res) => {
  try {
    // Input validation
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check for existing user with same username
    const existingUserByUsername = await User.findOne({ username }).lean();

    if (existingUserByUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Check for existing user with same email
    const existingUserByEmail = await User.findOne({ email }).lean();

    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true, // Setting verified to true since we're not using email verification
    });

    await newUser.save();

    // Login user using passport
    req.login(newUser, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to log in after signup",
          error: err.message,
        });
      }

      // Success response with user data
      return res.status(201).json({
        success: true,
        message: "Signup successful",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isVerified: newUser.isVerified,
        },
      });
    });
  } catch (error) {
    console.error("Sign-up error:", error);

    // Handle duplicate key errors explicitly
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during sign-up. Please try again later.",
    });
  }
});

//signup with email
// router.post("/sign-up", signupLimiter, async (req, res) => {
//   try {
//     // Input validation
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format",
//       });
//     }

//     // Password strength validation
//     if (password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters long",
//       });
//     }

//     // Check for existing verified user with same username
//     const existingVerifiedUserByUsername = await User.findOne({
//       username,
//       isVerified: true,
//     }).lean();

//     if (existingVerifiedUserByUsername) {
//       return res.status(409).json({
//         success: false,
//         message: "Username already taken",
//       });
//     }

//     // Check for existing user with same email
//     const existingUserByEmail = await User.findOne({ email }).lean();
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiration = new Date(Date.now() + 3600000); // 1 hour from now

//     if (existingUserByEmail) {
//       if (existingUserByEmail.isVerified) {
//         return res.status(409).json({
//           success: false,
//           message: "Email already registered",
//         });
//       }

//       // Update existing unverified user
//       const hashedPassword = await bcrypt.hash(password, 12);
//       await User.findOneAndUpdate(
//         { email },
//         {
//           username,
//           password: hashedPassword,
//           verifyCode,
//           verifyCodeExpiration: otpExpiration,
//           updatedAt: new Date(),
//         },
//         { runValidators: true }
//       );
//     } else {
//       // Create new user
//       const hashedPassword = await bcrypt.hash(password, 12);
//       const newUser = new User({
//         username,
//         email,
//         password: hashedPassword,
//         verifyCode,
//         verifyCodeExpiration: otpExpiration,
//         isVerified: false,
//       });
//       await newUser.save();
//     }

//     // Send OTP email
//     try {
//       await sendOTPEmail({
//         to: email,
//         username: username,
//         verifyCode: verifyCode,
//       });
//     } catch (emailError) {
//       // Log email error but don't fail the request
//       console.error("Failed to send OTP email:", emailError);
//       // Optionally delete the user if email fails
//       await User.deleteOne({ email });
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send verification email. Please try again.",
//       });
//     }

//     // Success response
//     return res.status(201).json({
//       success: true,
//       message: "Verification code sent to your email",
//       email: email,
//     });
//   } catch (error) {
//     console.error("Sign-up error:", error);

//     // Handle duplicate key errors explicitly
//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Username or email already exists",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "An error occurred during sign-up. Please try again later.",
//     });
//   }
// });

router.post("/verify-email", async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (user.verifyCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (new Date() > user.verifyCodeExpiration) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    user.isVerified = true;
    await user.save();

    req.login(user, (err) => {
      if (err) {
        res.json({
          success: false,
          message: "auto-login failed",
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Email verified and Logged in successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during verification",
      error: error.message,
    });
  }
});

router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        verifyCode,
        verifyCodeExpiration: otpExpiration,
      },
      { runValidators: true }
    );

    await sendOTPEmail({
      to: email,
      username: user.username,
      verifyCode: verifyCode,
    });

    return res.status(200).json({
      success: true,
      message: "New verification code sent successfully",
    });
  } catch (error) {
    console.error("Resend code error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resending the code",
    });
  }
});

export default router;
