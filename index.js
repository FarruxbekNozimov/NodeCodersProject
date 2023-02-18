require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	ctx.sendMessage(
		"Bot imkoniyatidan foydalanish uchun avval ro'yxatdan o'ting",
		Markup.keyboard([["Ro'yxatdan o'tish"]]).resize()
	);
});

bot.on("message", (ctx) => {
	let text = ctx.update.message.text;
	if (text == "Ro'yxatdan o'tish") {
		ctx.sendMessage(
			"OzodJS = bot",
			Markup.keyboard([["Usta", "Mijoz"]]).resize()
		);
	}
});

bot.launch();
