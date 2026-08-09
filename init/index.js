const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected DB");
}

const initDB = async () => {
    await Listing.deleteMany({});

    const data = [];

    for (const obj of initData.data) {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: `${obj.location}, ${obj.country}`,
                    format: "json",
                    limit: 1
                },
                headers: {
                    "User-Agent": "WanderLust/1.0"
                }
            }
        );

        if (!response.data.length) {
            console.log(`Location not found: ${obj.location}`);
            continue;
        }

        const { lat, lon } = response.data[0];

        data.push({
            ...obj,
            owner: "6a7183a926f8f1a5219a4ee7",
            geometry: {
                type: "Point",
                coordinates: [Number(lon), Number(lat)]
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await Listing.insertMany(data);

    console.log("Data was initialized");
};

async function start() {
    try {
        await main();
        await initDB();
        await mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
}

start();