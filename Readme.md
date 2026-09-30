# 🏡 WanderLust

A full-stack accommodation and travel listing platform inspired by modern property-booking applications. Users can explore listings, create and manage properties, upload images, leave reviews, and view locations on an interactive map.

🔗 **Live Demo:** https://wanderlust-vqea.onrender.com/

---

## 🚀 Features

- 🔐 User authentication and authorization
- 🏠 Create, edit, view and delete property listings
- 🔎 Search and category-based filtering
- ⭐ Reviews and ratings
- 🖼️ Cloudinary image upload and storage
- 🗺️ Interactive maps using Leaflet and OpenStreetMap
- 📍 Automatic location geocoding using Nominatim
- 💾 MongoDB Atlas database
- 🔒 Session-based authentication with Passport.js
- ⚠️ Server-side validation and centralized error handling
- 📱 Responsive UI
- ☁️ Deployed on Render

---

## 🛠️ Tech Stack

### Frontend
- EJS
- Bootstrap
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs
- Passport.js

### Database
- MongoDB
- Mongoose
- MongoDB Atlas

### Services & APIs
- Cloudinary
- Leaflet
- OpenStreetMap
- Nominatim Geocoding API

---

## 🏗️ Architecture

The application follows an **MVC architecture**:

```text
WanderLust
│
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # Application routes
├── views/           # EJS templates
├── utils/            # Utility functions
├── public/           # CSS & JavaScript
├── init/             # Database seed data
├── middleware/       # Authentication & validation
└── app.js            # Application entry point