const mongoose = require("mongoose");

const KasbSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, min: 3, max: 20, unique: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Kasb", KasbSchema);
