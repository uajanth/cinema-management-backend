// Package Imports
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const express = require("express");
const router = express.Router();

const calculateOrderAmount = (total) => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	return Math.round(Number(total) * 100);
};

router.post("/", async (req, res) => {
	const { items, total } = req.body;
	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(total),
		currency: "cad",
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

module.exports = router;
