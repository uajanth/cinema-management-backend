// Package Imports
const express = require("express");
const client = require("@sendgrid/mail");
const router = express.Router();

client.setApiKey(process.env.SENDGRID_API_KEY);

// prettier-ignore
const testData = {
	"title": "Test",
	"date": "October, 5 2022",
	"time": "11:59PM",
	"theatre": "1",
	"numberOfTickets": "2",
	"selectedSeats": "A1",
	"posterUrl":
		"https://cms-uajanth.vercel.app/_next/image?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FM%2FMV5BNmQyOTNmY2UtZTBhNi00NzNlLWIxOWEtYzhkODVkZWYwZGY5XkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_Ratio0.6762_AL_.jpg&w=384&q=75",
	"ticketType1": "General",
	"calcOfTicket1": "2",
	"ticketType2": "Child",
	"calcOfTicket2": "2",
	"ticketType3": "Senior",
	"calcOfTicket3": "2",
	"subtotal": "24.99",
	"tax": "1.01",
	"total": "26",
};

const message = {
	personalizations: [
		{
			dynamic_template_data: testData,
			to: [
				{
					email: "uthayakumaran.ajanth@gmail.com",
				},
			],
		},
	],
	from: {
		email: "contact@ajanth.dev",
		name: "Woodside Cinemas (Demo)",
	},
	replyTo: {
		email: "contact@ajanth.dev",
		name: "Woodside Cinemas Customer Service Team",
	},
	subject: "Woodside Cinemas Order Confirmation -", // make custom
	template_id: "d-0c9197583bce4e57a77d90e9296571a4",
};

router.get("/", (req, res) => {
	client
		.send(message)
		.then(() => console.log("Mail sent successfully"))
		.catch((error) => {
			console.error(error);
		});
	return res.status(200).json("Successfully sent email");
});

module.exports = router;
