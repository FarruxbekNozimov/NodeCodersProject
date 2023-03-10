const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		chatId: { type: Number, required: true },
		name: { type: String, required: true },
		phone: { type: String, required: true },
		role: { type: String, default: "user" },
		state: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
