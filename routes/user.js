// const express = require("express");
// const router = express.Router();
// let User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const passport = require("passport");


// router.get("/signup", (req, res) => {
//   // res.send("form");
//   res.render("users/signup.ejs");
// });

// router.post(
//   "/signup",
//   wrapAsync(async (req, res) => {
//     try {
//       let { username, email, password } = req.body;
//       const newUser = new User({ email, username });
//       const registeredUser = await User.register(newUser, password);
//       console.log(registeredUser);
//       req.flash("success", "Welcome to Wanderlust!");
//       res.redirect("/listings");
//     } catch (e) {
//       req.flash("error", e.message);
//       res.redirect("/signup");
//     }
//   })
// );

// router.get("/login", (req, res) => {
//   res.render("users/login.ejs");
// });

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   async (req, res) => {
//     console.log("hi i am to debug here");
//     req.flash("success","Welcome back to Wanderlust! you are logged in!");   
//     res.redirect("/listings");  
//     res.send("login");
//   }
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get("/signup", (req, res) => {
  // res.send("form");
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome back to Wanderlust! you are logged in!");   
    res.redirect("/listings"); 
  }
);

module.exports = router;