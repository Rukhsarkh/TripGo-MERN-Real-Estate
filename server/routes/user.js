import express from "express";
const router = express.Router();
import sendOTPEmail from "../helpers/sendOTPEmail.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

// Rate limiter for signup attempts
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: {
    success: false,
    message: "Too many signup attempts. Please try again later.",
  },
});

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

    // Check for existing verified user with same username
    const existingVerifiedUserByUsername = await User.findOne({
      username,
      isVerified: true,
    }).lean();

    if (existingVerifiedUserByUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Check for existing user with same email
    const existingUserByEmail = await User.findOne({ email }).lean();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Update existing unverified user
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.updateOne(
        { email },
        {
          $set: {
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiration: otpExpiration,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiration: otpExpiration,
        isVerified: false,
      });
      await newUser.save();
    }

    // Send OTP email
    try {
      await sendOTPEmail({
        to: email,
        username,
        verifyCode,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send OTP email:", emailError);
      // Optionally delete the user if email fails
      await User.deleteOne({ email });
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: "Verification code sent to your email",
      email: email,
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

export default router;
//test-route
// router.get("/get-hello", (req, res) => {
//   return res.json({ message: "hello" });
// });

// router.post("/sign-up", async (req, res) => {
//   try {
//     const { username, email, password } = await req.body;

//     const existingVerifiedUserByUsername = await User.findOne({
//       username,
//       isVerified: true,
//     });

//     if (existingVerifiedUserByUsername) {
//       return res.json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const existingUserByEmail = await User.findOne({ email });
//     let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//     if (existingUserByEmail) {
//       if (existingUserByEmail.isVerified) {
//         return res.json({
//           success: false,
//           message: "User already exists with this email",
//         });
//       } else {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         existingUserByEmail.password = hashedPassword;
//         existingUserByEmail.verifyCode = verifyCode;
//         existingUserByEmail.verifyCodeExpiration = new Date(
//           Date.now() + 3600000
//         );
//         await existingUserByEmail.save();
//       }
//     } else {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const otpExpiration = new Date();
//       otpExpiration.setHours(otpExpiration.getHours() + 1);

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

//     const sendEmail = await sendOTPEmail({
//       to: email,
//       username,
//       verifyCode,
//     });

//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       email: email,
//       otp: verifyCode,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// export default router;
