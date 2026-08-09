const mapElement = document.getElementById("map");

if (mapElement) {
    const coordinates = JSON.parse(mapElement.dataset.coordinates);

    const title = mapElement.dataset.title;
    const location = mapElement.dataset.location;
    const country = mapElement.dataset.country;

    const [longitude, latitude] = coordinates;

    const map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`
            <b>${title}</b><br>
            📍 ${location}, ${country}
        `)
        .openPopup();
}