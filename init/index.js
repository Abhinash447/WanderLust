const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a7183a926f8f1a5219a4ee7",
    }));

    await Listing.insertMany(data);

    console.log("Data was initialized");
};

initDB();