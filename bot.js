require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	ctx.sendMessage(
		"Bot imkoniyatidan foydalanish uchun avval ro'yxatdan o'ting",
		Markup.keyboard([["Ro'yxatdan o'tish"]]).resize()
	);
});



bot.hears("Usta", (ctx) =>
{
	ctx.sendMessage(
		"🥺 Iltimos, contactingizni biz bilan ulashing 🙏",
		Markup.keyboard([
			[Markup.button.contactRequest("☎ Contactni ulashish")],
		]).resize()
	);
});

bot.on("contact", (ctx) => {
	let {
		phone: phone_number,
		first_name,
		last_name,
	} = ctx.update.message.contact;
	let name = (first_name + " " + last_name).trim();
	ctx.sendMessage(
		"🥺 Iltimos, joylashuvingizni biz bilan ulashing 🙏",
		Markup.keyboard([
			[Markup.button.locationRequest("📍 Joylashuvingizni ulashish")],
		]).resize()
	);
});

bot.hears("Ro'yxatdan o'tish", (ctx) => {
	ctx.sendMessage(
		"Ro'yxatdan o'tish uchun variantlarni tanlang 👌",
		Markup.keyboard([["Usta", "Mijoz"]]).resize()
	);
});

bot.on("location", (ctx) => {
	let { latitude, longitude } = ctx.update.message.location;
});

bot.launch();
