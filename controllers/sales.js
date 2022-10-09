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
		ticketsByGroup,
		orderBreakdown,
	} = req.body;

	const ticketType1 = JSON.parse(ticketsByGroup)[0];
	const ticketType2 = JSON.parse(ticketsByGroup)[1];
	const ticketType3 = JSON.parse(ticketsByGroup)[2];

	const calcOfTicket1 = `${ticketType1.quantity} x $${ticketType1.price} = $${
		Number(ticketType1.price) * Number(ticketType1.quantity)
	}`;

	const calcOfTicket2 = `${ticketType2.quantity} x $${ticketType2.price} = $${
		Number(ticketType2.price) * Number(ticketType2.quantity)
	}`;

	const calcOfTicket3 = `${ticketType3.quantity} x $${ticketType3.price} = $${
		Number(ticketType3.price) * Number(ticketType3.quantity)
	}`;

	const orderSummary = JSON.parse(orderBreakdown);

	// prettier-ignore
	const data = {
	"title": `${movieTitle}`,
	"date": `${showDate}`,
	"time": `${startTime}`,
	"theatre": `${theatre}`,
	"numberOfTickets": `${totalTickets}`,
	"selectedSeats": `${selectedSeats}`,
	"posterUrl": `${posterLink}`,
	"ticketType1": `${ticketType1.name}`,
	"calcOfTicket1": calcOfTicket1,
	"ticketType2": `${ticketType2.name}`,
	"calcOfTicket2": calcOfTicket2,
	"ticketType3": `${ticketType3.name}`,
	"calcOfTicket3": calcOfTicket3,
  "bookingFee": `${orderSummary.bookingFee}`,
	"subtotal": `${orderSummary.subtotal}`,
	"tax": `${orderSummary.taxes}`,
	"total": `${orderSummary.total}`,
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
