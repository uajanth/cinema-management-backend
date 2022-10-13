// Package Imports
const express = require("express");
const movie = require("../models/movie");
const router = express.Router();

// Other Imports
const { Movie } = require("../models/movie");

// Route >> /movies/...

// GET movies from database
router.get("/", async (req, res) => {
	try {
		const movies = await Movie.find();
		if (movies.length < 1) {
			return res.status(200).json("No Movies Found");
		}
		return res.status(200).json(movies);
	} catch (error) {
		console.log(error);

		return res.status(504).json("Unable to retrieve movies from the database.");
	}
});

// GET upcoming movies from database
router.get("/upcoming", async (req, res) => {
	try {
		const movies = await Movie.find({ status: "upcoming" }); //
		if (movies.length < 1) {
			return res.status(200).json("No upcoming movies Found");
		}
		return res.status(200).json(movies);
	} catch (error) {
		console.log(error);

		return res
			.status(504)
			.json("Unable to retrieve upcoming movies from the database.");
	}
});

// GET movie(s) from database with ID
router.get("/id/:id", async (req, res) => {
	let { id } = req.params;
	// transform id(s) into a list
	const ids = id.split(",");

	// // if there is more than 1 id
	if (ids.length > 1) {
		try {
			const movies = await Movie.find({ _id: { $in: ids } });
			return res.status(200).json(movies);
		} catch (error) {
			console.log(error);

			return res
				.status(504)
				.json("Unable to retrieve movies from the database.");
		}
	}

	try {
		const movie = await Movie.findById(ids[0]);

		return res.status(200).json([movie]);
	} catch (error) {
		console.log(error);
		return res.status(504).json("Unable to retrieve movie from the database.");
	}
});

// PUT movie in database

router.put("/id", async (req, res) => {
	const {
		id,
		title,
		summary,
		language,
		cast,
		director,
		trailerLink,
		releaseDate,
		status,
		rating,
		posterLink,
	} = req.body;

	try {
		await Movie.findByIdAndUpdate(
			{ _id: id },
			{
				title,
				summary,
				language,
				cast,
				director,
				trailerLink,
				releaseDate,
				status,
				rating,
				posterLink,
			}
		);

		return res.status(200).json(`Successfully updated ${title}!`);
	} catch (error) {
		console.log(error);

		return res.status(504).json(`Unable to update movie.`);
	}
});

// POST movie to database
router.post("/", async (req, res) => {
	const {
		title,
		summary,
		language,
		cast,
		director,
		trailerLink,
		releaseDate,
		status,
		rating,
		runtime,
		runtimeStr,
		posterLink,
	} = req.body;

	try {
		const movie = new Movie({
			title,
			summary,
			language,
			cast,
			director,
			trailerLink,
			releaseDate,
			status,
			rating,
			runtime,
			runtimeStr,
			posterLink,
		});

		movie.save();

		return res.status(200).json(`Successfully added ${title}!`);
	} catch (error) {
		console.log(error);

		return res.status(504).json(`Unable to add movie.`);
	}
});

// DELETE movie from database with ID
router.delete("/id/:id", async (req, res) => {
	let { id } = req.params;

	// transform id(s) into a list
	if (id.includes(",")) {
		id = id.split(",");
		try {
			for (let i = 0; i < id.length; i++) {
				await Movie.findByIdAndDelete(id[i]);
			}
			return res.status(200).json(`Successfully deleted movies!`);
		} catch (error) {
			console.log(error);

			return res.status(504).json("Unable to delete movies.");
		}
	}

	try {
		await Movie.findByIdAndDelete(id);
		return res.status(200).json(`Successfully deleted movie!`);
	} catch (error) {
		console.log(error);

		return res.status(504).json("Unable to delete movie.");
	}
});

module.exports = router;
