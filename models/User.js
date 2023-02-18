const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		phone: { type: String, required: true },
		role: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
