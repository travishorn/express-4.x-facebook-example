/* TODO:
 * - Set up a DB
 * - Save session info into DB to persist across restarts
 * - More TODOs in code below...
 */

require("dotenv").config();

const path = require("path");
const express = require("express");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/log-in/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      /* TODO: Search for user in DB based on returned profile info
       * If no user exists, create it
       * Call back with profile info as saved in DB (or maybe just the ID)
       * For right now, we're just calling back the complete profile from Google
       */
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  /*
   * TODO: Send just a unique user ID
   * For right now, we're sending the complete profile so deserializeUser has all the info
   */
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  /*
   * TODO: Query user record from DB using ID in obj during this step
   * For right now, obj contains the complete profile as sent by serializeUser
   */
  cb(null, obj);
});

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const ensureLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect(`/log-in?state=${req.url}`);
  } else {
    next();
  }
};

app.get("/", ensureLoggedIn, (req, res) => {
  res.render("home", { user: req.user });
});

app.get("/log-in", (req, res) => {
  res.render("log-in", { state: req.query.state });
});

app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/log-in/google", (req, res) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: req.query.state,
  })(req, res);
});

app.get(
  "/log-in/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: `/log-in?state=${req.query.state}`,
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(req.query.state);
  }
);

app.get("/profile", ensureLoggedIn, (req, res) => {
  res.render("profile", { user: req.user });
});

app.listen(process.env.PORT || 3000);
