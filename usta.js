require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

let user = {
	name: "",
	phone: "",
	kasb: "",
	ustaxonaNomi: "",
	manzil: "",
	moljal: "",
	lokatsiya: "",
	boshlanishi: "",
	yakunlashi: "",
	mijozVaqti: "",
};
let kasblar = [
	"Sartaroshxona",
	"Go'zallik saloni",
	"Zargarlik Ustaxonasi",
	"Poyabzal Ustaxonasi",
	"Soatsoz",
	"Poyabzal Ustaxonasi",
];

bot.start((ctx) => {
	ctx.replyWithHTML(
		"👋 <b>Assalomu alaykum XUSH KELIBSIZ</b>\n\n<i>🏆 Botdan foydalanish uchun avval ro'yxatdan o'ting !!!</i>",
		Markup.keyboard([["👉 Ro'yxatdan o'tish"]]).resize()
	);
});

bot.hears("👉 Ro'yxatdan o'tish", (ctx) => {
	ctx.sendMessage(
		"⭐️ Ro'yxatdan o'tish uchun variantlardan birini tanlang 👌",
		Markup.keyboard([["Usta", "Mijoz"]]).resize()
	);
	console.log(user);
});

bot.hears("Usta", async (ctx) => {
	try {
		console.log(ctx.update.message.text);
		if (ctx.update.message.text == "🔙 Ortga") {
			ctx.replyWithHTML(
				"👋 <b>Assalomu alaykum XUSH KELIBSIZ</b>\n\n<i>🏆 Botdan foydalanish uchun avval ro'yxatdan o'ting !!!</i>",
				Markup.keyboard([["👉 Ro'yxatdan o'tish"]]).resize()
			);
		}
		let btns = kasblar.map((k) => [k]);
		// ctx.replyWithHTML(
		// 	"<i><b>Hey Usta</b>, o'zingizni yo'nalishingizni tanlang.</i> 👇",
		// 	Markup.keyboard([...btns, ["🔙 Ortga"]]).resize()
		// );
		await ctx.reply("Enter your email");
		ctx.then(
			ctx.reply("i will call you " + ctx.update.message.text + " from now on")
		);
		// email = ctx.update.message?.text;

		// await ctx.reply("Enter your password");
		// password = ctx.update.message?.text;

		bot.on("contact", (ctx) => {
			let {
				phone_number: phone,
				first_name,
				last_name,
			} = ctx.update.message.contact;
			let name = (first_name + " " + last_name).trim();
			user = { name, phone, ...user };
			ctx.replyWithHTML(
				`<b>${name}</b> joylashuvingizni  ulashing 📍`,
				Markup.keyboard([
					[Markup.button.locationRequest("📍 Joylashuvni ulashish")],
					["🔙 Ortga"],
				]).resize()
			);
			console.log(user);
		});

		bot.on("location", async (ctx) => {
			let { latitude, longitude } = ctx.update.message.location;
			user = { ...user, manzil: [latitude, longitude] };
			// ctx.replyWithHTML(
			// 	"Ustaxona nomini kiriting",
			// 	Markup.inlineKeyboard([
			// 		Markup.button.callback("Keyingisi >>", "skip"),
			// 	]).resize()
			// );
			console.log(ctx.update);
			bot.on("text", (msg) => {
				console.log(msg);
				let ustaxonaNomi = msg.message.text;
				console.log(ustaxonaNomi);
				user = { ...user, ustaxonaNomi };
				console.log(user);
				ctx.reply(
					"Ustaxona mo'ljalini kiriting",
					Markup.inlineKeyboard([
						Markup.button.callback("Keyingisi >>", "skip"),
					]).resize()
				);
				console.log("salom");
			});
		});

		bot.on("callback_query", async (ctx) => {
			ctx.reply(`Your answer was: ${ctx.update.callback_query.data}`);
		});

		bot.action("skip", (ctx) => {
			ctx.editMessageText(
				"Ustaxona mo'ljalini kiriting",
				Markup.inlineKeyboard([
					Markup.button.callback("Keyingisi >>", "skip"),
				]).resize()
			);
		});

		bot.on("message", (msg) => {
			let kasb = msg.message.text;
			if (kasb == "🔙 Ortga") {
				ctx.replyWithHTML(
					"👋 <b>Assalomu alaykum XUSH KELIBSIZ</b>\n\n<i>🏆 Botdan foydalanish uchun avval ro'yxatdan o'ting !!!</i>",
					Markup.keyboard([["👉 Ro'yxatdan o'tish"]]).resize()
				);
			} else if (kasblar.includes(kasb)) {
				ctx.sendMessage(
					"🥺 Iltimos, contactingizni biz bilan ulashing 🙏",
					Markup.keyboard([
						[Markup.button.contactRequest("☎ Contactni ulashish")],
						["🔙 Ortga"],
					]).resize()
				);
			}
			user = { ...user, kasb };
		});
		console.log(user);
	} catch (error) {
		ctx.sendMessage("XATOLIK ❌❌❌");
	}
});

bot.launch();
