const mongoose = require("mongoose");

const UstaSchema = new mongoose.Schema(
	{
		chatId: { type: String, required: true },
		name: { type: String, required: true },
		phone: { type: String, required: true },
		kasb: { type: String, required: true },
		ustaxonaNomi: { type: String },
		manzil: { type: Array },
		moljal: { type: String },
		lokatsiya: { type: String, required: true },
		boshlanishi: { type: String, required: true },
		yakunlashi: { type: String, required: true },
		mijozVaqti: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Usta", UstaSchema);
