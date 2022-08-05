// Package Imports
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Other Imports
const { Show } = require("../models/show");
const { Theatre } = require("../models/theatre");
const { route } = require("./movies");
var addDays = require("date-fns/addDays");

// Route >> /shows/...

// GET shows from database
router.get("/", async (req, res) => {
	try {
		const shows = await Show.find()
			.sort({ date: 1, startTime: 1 })
			.populate("movie")
			.exec();

		return res.status(200).json(shows);
	} catch (error) {
		console.log(error);

		return res.status(504).json("Unable to retrieve shows from the database.");
	}
});

router.get("/id/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const show = await Show.find({ _id: id }).populate("movie").exec();
		return res.status(200).json(show);
	} catch (error) {
		console.log(error);
		return res.status(504).send("No show found.");
	}
});

router.get("/id/:id/theatre", async (req, res) => {
	const { id } = req.params;
	try {
		const theatre = await Show.find({ _id: id }, "theatre");
		console.log(theatre);
		return res.status(200).json(theatre);
	} catch (error) {
		return res.status(504).send(`No theatre found for show.`);
	}
});

router.get("/date/:date", async (req, res) => {
	const { date } = req.params;
	try {
		const shows = await Show.find({
			date: {
				$gte: new Date(date),
				$lt: new Date(addDays(new Date(date), 1)),
			},
		})
			.populate("movie")
			.exec();
		return res.status(200).json(shows);
	} catch (error) {
		console.log(error);
		return res
			.status(504)
			.json(`Unable to find any shows for the requested date.`);
	}
});

router.get("/date/:date/movieid/:movieid", async (req, res) => {
	const { date, movieId } = req.params;

	try {
		const shows = await Show.find(
			{ date: date, movie: movieId },
			{
				_id: 1,
				language: 1,
				startTime: 1,
				startTime12: 1,
				movie: 1,
			}
		)
			.populate({ path: "movie", select: "_id" })
			.exec();
		return res.status(200).json(shows);
	} catch (error) {
		console.log(error);
		return res
			.status(504)
			.json(`Unable to find any show for ${movieId} on ${date}`);
	}
});

// POST show to database
router.post("/", async (req, res) => {
	const {
		date,
		movieId,
		language,
		theatre,
		startTime,
		endTime,
		intermissionLength,
		cleanupLength,
	} = req.body;

	const formatTime = (time) => {
		// Example of input -> "18:00"
		const [hour, min] = time.split(":");
		const formattedTime = [];

		if (hour == 0) {
			return `12:${min} AM`;
		} else if (hour == 12) {
			return `12:${min} PM`;
		} else if (hour < 12) {
			return `${hour}:${min} AM`;
		} else {
			return `${hour - 12}:${min} PM`;
		}
	};

	try {
		const show = new Show({
			date: new Date(date),
			movie: movieId,
			language,
			startTime,
			startTime12: formatTime(startTime),
			intermissionLength,
			endTime,
			cleanupLength,
			theatre,
		});

		show.theatre = await Theatre.findOne(
			{ theatre },
			{
				_id: 0,
				theatre: 1,
				maxRowLength: 1,
				verticalSort: 1,
				horizontalSort: 1,
				rows: 1,
			}
		);

		show.set("_id", undefined, { strict: false });

		show.save();

		return res.status(200).json(`Successfully Added Show!`);
	} catch (error) {
		console.log(error);

		return res.status(504).json(`Unable to add show.`);
	}
});

// POST update a seat to a show,
// next step is to check if the seat is already available
router.put("/seat", async (req, res) => {
	const { id, seatId } = req.body;
	try {
		const seatRow = seatId[0];

		// Aggregation Pipeline to split theatre into documents for each row
		const rows = await Show.aggregate([
			{
				$match: {
					_id: mongoose.Types.ObjectId(id),
				},
			},
		])
			.unwind({
				path: "$theatre.rows",
			})
			.exec();

		// Row
		const matchingRow = [];

		rows.forEach((row, index) => {
			if (row.theatre.rows.name === seatRow) {
				matchingRow.push(Object.assign({}, row, { index }));
			}
		});

		const rowIndex = matchingRow[0].index;

		// Seat
		const seats = matchingRow[0].theatre.rows.seats;

		const matchingSeat = seats.filter((seat) => seat.label === seatId);

		const seatIndex = matchingSeat[0].index;

		const seatStatus = `theatre.rows.${rowIndex}.seats.${seatIndex}.status`;
		const seatIsAvailable = `theatre.rows.${rowIndex}.seats.${seatIndex}.IsAvailable`;

		// Update Seat Status and Availability
		const filter = {
			_id: mongoose.Types.ObjectId(id),
			"theatre.rows.seats.label": seatId,
		};

		const update = {
			$set: {
				[seatStatus]: "occupied",
				[seatIsAvailable]: false,
			},
		};

		const show = await Show.findOneAndUpdate(filter, update, { new: true });
		show.save();

		return res.status(200).json(show);
	} catch (error) {
		console.log(error);
		return res.status(504).json(`Unable to update seat`);
	}
});

// DELETE shows from database with ID
router.delete("/id/:id", async (req, res) => {
	let { id } = req.params;

	// transform id(s) into a list
	if (id.includes(",")) {
		id = id.split(",");
		try {
			for (let i = 0; i < id.length; i++) {
				await Show.findByIdAndDelete(id[i]);
			}
			return res.status(200).json(`Successfully deleted shows!`);
		} catch (error) {
			console.log(error);

			return res.status(504).json("Unable to delete shows.");
		}
	}

	try {
		await Show.findByIdAndDelete(id);
		return res.status(200).json(`Successfully deleted show!`);
	} catch (error) {
		console.log(error);

		return res.status(504).json("Unable to delete show.");
	}
});

module.exports = router;
