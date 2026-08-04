const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const newUser = new User({
                username,
                email,
            });

            await User.register(newUser, password);

            req.flash("success", "Welcome to WanderLust! Your account has been created.");
            res.redirect("/listings");

        } catch (err) {

            if (err.name === "UserExistsError") {
                req.flash("error", "Username already exists. Please choose another one.");
            } else {
                req.flash("error", "Unable to create your account. Please try again.");
            }

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
    (req, res) => {
        req.flash("success", "Welcome back to WanderLust!");
        res.redirect("/listings");
    }
);

module.exports = router;