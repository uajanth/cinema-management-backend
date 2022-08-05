// Package Imports
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Other Imports
const movies = require("./controllers/movies");
const shows = require("./controllers/shows");
const sessions = require("./controllers/sessions");
const theatres = require("./controllers/theatres");

// Middleware
app.use(express.json()); // Bodyparser
app.use(cors());

const PORT = process.env.PORT || 3000;

// Database Connections
mongoose.connect(
	`mongodb+srv://admin:ghx0G6KrE6lfMrFR@cluster0.7djwyi2.mongodb.net/?retryWrites=true&w=majority`
);

// Routes
app.get("/", (req, res) => {
	res.send("Enter a valid endpoint to get started.");
});

app.use("/movies", movies);

app.use("/shows", shows);

app.use("/theatres", theatres);

app.use("/sessions", sessions);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
