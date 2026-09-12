const axios = require("axios");
const Listing = require("../models/listing");
const categorizeListing = require("../utils/categorizeListing");

module.exports.index = async (req, res) => {
    const { search, category } = req.query;

    let filter = {};

    // Search filter
    if (search && search.trim() !== "") {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                location: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                country: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Category filter
    if (category && category !== "trending") {
        filter.category = category;
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index", {
        allListings,
        search: search || "",
        category: category || "trending"
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

// module.exports.createListing = async (req, res) => {
//     let response = await geocodingClient
//         .forwardGeocode({
//             query: req.body.listing.location,
//             limit: 1,
//         })
//         .send();
//     // console.log(response.body.features[0].geometry);
//     // res.send("done");

//     let url = req.file.path;
//     let filename = req.file.filename;

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = {url, filename};

//     newListing.geometry = response.body.features[0].geometry;

//     let savedListing = await newListing.save();
//     console.log(savedListing);
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// }


// const axios = require("axios");
// const Listing = require("../models/listing");


module.exports.createListing = async (req, res) => {
    const { location, country } = req.body.listing;

    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: `${location}, ${country}`,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "WanderLust/1.0"
            }
        }
    );

    if (!response.data.length) {
        req.flash("error", "Location could not be found.");
        return res.redirect("/listings/new");
    }

    const { lat, lon } = response.data[0];

    const newListing = new Listing(req.body.listing);

    // Owner
    newListing.owner = req.user._id;

    // Automatically categorize listing
    newListing.category = categorizeListing(
        newListing.title,
        newListing.description,
        newListing.location
    );

    // Image
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };

    // Location coordinates
    newListing.geometry = {
        type: "Point",
        coordinates: [Number(lon), Number(lat)]
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, {
//         ...req.body.listing,
//     });

//     if(typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = { url, filename };
//         await listing.save();
//     }

//     req.flash("success", "Listing updated successfully.");
//     res.redirect(`/listings/${id}`);
// }


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { location, country } = req.body.listing;

    // Get new coordinates
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: `${location}, ${country}`,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "WanderLust/1.0"
            }
        }
    );

    if (!response.data.length) {
        req.flash("error", "Location could not be found.");
        return res.redirect(`/listings/${id}/edit`);
    }

    const { lat, lon } = response.data[0];

    const listing = await Listing.findByIdAndUpdate(
        id,
        {
            ...req.body.listing,
            geometry: {
                type: "Point",
                coordinates: [Number(lon), Number(lat)]
            }
        },
        { new: true }
    );

    // Update image only if a new image was uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };

        await listing.save();
    }

    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}