const categories = {
    mountains: [
        "mountain",
        "mountains",
        "hill",
        "hills",
        "himalaya",
        "himalayas",
        "valley",
        "peak"
    ],

    castles: [
        "castle",
        "palace",
        "fort",
        "fortress"
    ],

    pools: [
        "pool",
        "swimming",
        "beach",
        "resort"
    ],

    camping: [
        "camping",
        "camp",
        "tent",
        "campsite"
    ],

    farms: [
        "farm",
        "farmhouse",
        "ranch"
    ],

    arctic: [
        "snow",
        "snowy",
        "ice",
        "arctic",
        "winter",
        "glacier"
    ],

    rooms: [
        "room",
        "apartment",
        "hotel",
        "hostel",
        "studio"
    ],

    iconic: [
        "city",
        "downtown",
        "landmark",
        "famous"
    ]
};

function categorizeListing(title, description, location) {

    const text = `
        ${title || ""}
        ${description || ""}
        ${location || ""}
    `.toLowerCase();

    for (const category in categories) {

        for (const keyword of categories[category]) {

            if (text.includes(keyword)) {
                return category;
            }

        }
    }

    return "trending";
}

module.exports = categorizeListing;