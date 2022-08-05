const mongoose = require("mongoose");

const TheatreSchema = new mongoose.Schema({
	theatre: String,
	maxRowLength: String,
	verticalSort: String,
	horizontalSort: String,
	rows: Array,
});

const Theatre = mongoose.model("Theatre", TheatreSchema);

module.exports = {
	Theatre: Theatre,
};
