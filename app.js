const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database Connection
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Home Route
app.get("/", (req, res) => {
    res.send("Hi, I am root!");
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// 404 Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!" } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// Server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});