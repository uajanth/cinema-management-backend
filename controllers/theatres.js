// Package Imports
const express = require("express");
const router = express.Router();

// Other Imports
const { Theatre } = require("../models/theatre");

// Route >> /theatres/...

// GET theatres from database
router.get("/", async (req, res) => {
	try {
		const theatres = await Theatre.find();
		if (theatres.length < 1) {
			return res.status(200).json("No Theatres Found");
		}
		return res.status(200).json(theatres);
	} catch (error) {
		console.log(error);

		return res
			.status(504)
			.json("Unable to retrieve theatres from the database.");
	}
});

module.exports = router;
