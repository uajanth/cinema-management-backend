// Package Imports
const express = require("express");
const client = require("@sendgrid/mail");
const router = express.Router();

client.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", (req, res) => {
	const {
		emailAddress,
		posterLink,
		movieTitle,
		showDate,
		startTime,
		theatre,
		totalTickets,
		selectedSeats,
	} = req.body;

	// prettier-ignore
	const data = {
	"title": `${movieTitle}`,
	"date": `${showDate}`,
	"time": `${startTime}`,
	"theatre": `${theatre}`,
	"numberOfTickets": `${totalTickets}`,
	"selectedSeats": `${selectedSeats}`,
	"posterUrl": `${posterLink}`,
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
				dynamic_template_data: data,
				to: [
					{
						email: emailAddress,
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

	client
		.send(message)
		.then(() => console.log("Mail sent successfully"))
		.catch((error) => {
			console.error(error);
		});
	return res
		.status(200)
		.json(`Successfully sent email confirmation to ${emailAddress}`);
});

module.exports = router;
