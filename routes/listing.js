const express = require("express");
const router = express.Router();
// Models
const Listing = require("../models/listing");
// Utilities
const wrapAsync = require("../utils/wrapAsync");
const { isLogin, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLogin, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Route
// GET /listings/new
router.get("/new", isLogin, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLogin, 
        isOwner, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLogin, isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit Route
// GET /listings/:id/edit
router.get("/:id/edit", isLogin, isOwner,
    wrapAsync(listingController.editListing)
);


module.exports = router;