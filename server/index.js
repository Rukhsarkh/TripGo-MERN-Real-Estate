import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./helpers/db.js";
import listing from "./routes/listing.js";
import review from "./routes/review.js";
import user from "./routes/user.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import MongoStore from "connect-mongo";
dotenv.config();

connectDB();

const app = express();

// Add before middleware setup
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET_CODE));

app.use(
  session({
    secret: process.env.SESSION_SECRET_CODE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

//Passport's Local Strategy (username, password)
import { compareSync } from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        if (!compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

//Passport's Google OAuth2.0 Strategy
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) return done(null, existingUser);

        // check by email (in case user already exists via local signup)
        const userByEmail = await User.findOne({
          email: profile.emails[0].value,
        });

        if (userByEmail) {
          // optionally: link their googleId
          userByEmail.googleId = profile.id;
          await userByEmail.save();
          return done(null, userByEmail);
        }

        //new Google User
        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Redirect user to Google for login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google will redirect back to this route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    try {
      // console.log(typeof req.user.avatar);
      // console.log("req.user.avatar: ", req.user.avatar);
      res.redirect(`${process.env.FRONTEND_URL}/account`);
    } catch (error) {
      // console.log("Redirect Err: ", err);
      res.status(500).send("Something went wrong after login");
    }
  }
);

// Detailed CORS configuration
const corsOptions = {
  origin: [
    "https://supertripdotcom.onrender.com", // frontend URL
    "http://localhost:3000", // Local Backend URL
    "http://localhost:5173", // Vite default dev server
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Credentials",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Preflight request handler
app.options("*", cors(corsOptions));

//Persists user data inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", (_, res) => {
  res.send("aPi is running ....");
});

app.use((req, _, next) => {
  // console.log("****************************************");
  // console.log("Session-Id", req.session.id);
  // console.log("****************************************");
  // console.log("Session", req.session);
  // console.log("****************************************");
  next();
});

app.use("/api/listings", listing);
app.use("/api", review);
app.use("/user", user);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is listening on ${PORT}`));
