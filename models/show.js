const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShowSchema = new mongoose.Schema({
	date: { type: Schema.Types.Date },
	movie: { type: Schema.Types.ObjectId, ref: "Movie" },
	language: String,
	theatre: {
		theatre: String,
		maxRowLength: String,
		verticalSort: String,
		horizontalSort: String,
		rows: Array,
	},
	startTime: String,
	startTime12: String,
	endTime: String,
	intermissionLength: String,
	cleanupLength: String,
});

const Show = mongoose.model("Show", ShowSchema);

module.exports = {
	Show: Show,
};
