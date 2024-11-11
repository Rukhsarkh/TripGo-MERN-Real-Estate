import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./helpers/db.js";
import listing from "./routes/listing.js";
import review from "./routes/review.js";
import user from "./routes/user.js";
import User from "./models/user.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import MongoStore from "connect-mongo";
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

mongoStore.on("error", (error) => {
  console.log("ERROR in MONGO SESSION STORE", error);
});

const sessionOptions = {
  name: "connect.sid",
  secret: process.env.SESSION_SECRET_CODE,
  resave: true,
  saveUninitialized: true,
  store: mongoStore,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  },
  rolling: true,
};

app.use(cookieParser(process.env.SESSION_SECRET_CODE));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select(
      "-password -verifyCode -verifyCodeExpiration"
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("Cookies:", req.cookies);
  next();
});

app.get("/", (req, res) => {
  res.send("aPi is running ....");
});

app.get("/greet", (req, res) => {
  const { name = "anon" } = req.query;
  req.session.name = name;
  res.send(req.session.name);
  console.log(req.session);
});

app.use("/api/listings", listing);
app.use("/api", review);
app.use("/user", user);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is listening on ${PORT}`));
