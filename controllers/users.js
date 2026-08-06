const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
        });

        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust! Your account has been created.");
            res.redirect("/listings");
        });
    } catch (err) {

        if (err.name === "UserExistsError") {
            req.flash("error", "Username already exists. Please choose another one.");
        } else {
            req.flash("error", "Unable to create your account. Please try again.");
        }

        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");

    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You have been logged out successfully.");
        res.redirect("/listings");
    });
}