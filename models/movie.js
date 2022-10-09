const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
	title: String,
	summary: String,
	language: String,
	cast: String,
	director: String,
	trailerLink: String,
	releaseDate: String,
	status: String,
	rating: String,
	runtime: Number,
	runtimeStr: String,
	posterLink: String,
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = {
	Movie: Movie,
};
