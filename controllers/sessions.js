// Package Imports
const express = require("express");
const router = express.Router();
const redis = require("redis");
const short = require("short-uuid");

// Other Imports
const addMinutes = require("date-fns/addMinutes");
const { response } = require("express");
// ...

const redisClient = redis.createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
	password: process.env.REDIS_PASSWORD,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Open redis connection once the server starts
(async function start() {
	await redisClient.connect();
})();

// Route >> /sessions/...

// GET session from database using session id
router.get("/id/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const doesSessionExist = await redisClient.exists(id);

		if (doesSessionExist) {
			const sessionDetails = await redisClient.hGetAll(id);
			return res.status(200).json({ sessionDetails });
		}

		return res.status(504).json(`Session does not exist.`);
	} catch (error) {
		console.log(error);
		return res.status(504).json(`Unable to find specified session.`);
	}
});

// POST create a session using the showId and returns the session
router.post("/", async (req, res) => {
	const { showId } = req.body;

	const expiresAt = addMinutes(new Date(), 5);

	try {
		const sessionId = short.generate();

		// By default connects to http://localhost://6379
		await redisClient.hSet(sessionId, "showId", showId);
		await redisClient.hSet(sessionId, "email", false);
		await redisClient.hSet(sessionId, "totalTickets", 0);
		await redisClient.hSet(sessionId, "ticketsByGroup", "[]");
		await redisClient.hSet(sessionId, "seatsSelected", "[]");
		await redisClient.hSet(sessionId, "checkoutStep", 1);
		await redisClient.hSet(sessionId, "expiresAt", String(expiresAt));
		await redisClient.expire(sessionId, 300);

		const sessionDetails = await redisClient.hGetAll(sessionId);

		const session = Object.assign({}, sessionDetails, { id: sessionId });

		return res.status(200).json(session);
	} catch (error) {
		console.log(error);

		return res.status(504).json(`Unable to create a session.`);
	}
});

// PUT update a session info
router.put("/id", async (req, res) => {
	const {
		id,
		email,
		totalTickets,
		ticketsByGroup,
		seatsSelected,
		checkoutStep,
	} = req.body;

	try {
		if (totalTickets != "false") {
			await redisClient.hSet(id, "totalTickets", totalTickets);
		}
		if (email != "false") {
			await redisClient.hSet(id, "email", email);
		}
		if (ticketsByGroup != "false") {
			await redisClient.hSet(id, "ticketsByGroup", ticketsByGroup);
		}
		if (seatsSelected != "false") {
			await redisClient.hSet(id, "seatsSelected", seatsSelected);
		}
		if (checkoutStep != "false") {
			await redisClient.hSet(id, "checkoutStep", checkoutStep);
		}

		const session = await redisClient.hGetAll(id);
		return res.status(200).json({ session });
	} catch (error) {
		console.log(error);
		return res.status(504).json(`Unable to update session.`);
	}
});

// PUT update expiration time

// DELETE session from database with ID
router.delete("/id/:id", async (req, res) => {
	let { id } = req.params;

	try {
		await redisClient.del(id);
		return res.status(200).json(`Successfully deleted session ${id}.`);
	} catch (error) {
		console.log(error);
		return res.status(504).json(`Unable to delete session.`);
	}
});

module.exports = router;
