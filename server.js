// Package Imports
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Other Imports
const movies = require("./controllers/movies");
const purchase = require("./controllers/purchase");
const sales = require("./controllers/sales");
const shows = require("./controllers/shows");
const sessions = require("./controllers/sessions");
const theatres = require("./controllers/theatres");

// Middleware
app.use(express.json()); // Bodyparser
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Database Connections
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.get("/", (req, res) => {
	res.send("Enter a valid endpoint to get started.");
});

app.use("/movies", movies);

app.use("/purchase", purchase);

app.use("/sales", sales);

app.use("/shows", shows);

app.use("/theatres", theatres);

app.use("/sessions", sessions);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
