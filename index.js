require("dotenv").config();
const mongoose = require("mongoose");
require("./usta");

mongoose.set("strictQuery", true);
mongoose.connect(
	process.env.MONGOOSE_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log("Connect to MongoDB")
);
