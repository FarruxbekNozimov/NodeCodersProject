const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

let userOne = {
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
});

bot.hears("Usta", async (ctx) => {
	try {
		if (ctx.update.message.text == "🔙 Ortga") {
			ctx.replyWithHTML(
				"👋 <b>Assalomu alaykum XUSH KELIBSIZ</b>\n\n<i>🏆 Botdan foydalanish uchun avval ro'yxatdan o'ting !!!</i>",
				Markup.keyboard([["👉 Ro'yxatdan o'tish"]]).resize()
			);
		}
		let btns = kasblar.map((k) => [k]);
		ctx.replyWithHTML(
			"<i><b>Hurmatli Usta</b>, o'zingizni yo'nalishingizni tanlang.</i> 👇",
			Markup.keyboard([...btns, ["🔙 Ortga"]]).resize()
		);

		bot.on("contact", (ctx) => {
			let {
				phone_number: phone,
				first_name,
				last_name,
			} = ctx.update.message.contact;
			let name = (first_name + " " + last_name).trim();
			userOne = { ...userOne, name, phone };
			ctx.replyWithHTML(
				`<b>${name}</b> joylashuvingizni  ulashing 📍`,
				Markup.keyboard([
					[Markup.button.locationRequest("📍 Joylashuvni ulashish")],
					["🔙 Ortga"],
				]).resize()
			);
		});

		bot.on("location", async (ctx) => {
			let { latitude, longitude } = ctx.update.message.location;
			userOne = { ...userOne, lokatsiya: [latitude, longitude] };
			ctx.replyWithHTML(
				"Ustaxona nomini kiriting",
				Markup.inlineKeyboard([
					Markup.button.callback("Keyingisi >>", "skip"),
				]).resize()
			);
			if (!userOne["moljal"]) {
				bot.on("message", (msg) => {
					let ustaxonaNomi = msg.message.text;
					userOne = { ...userOne, ustaxonaNomi };
					ctx.reply(
						"Ustaxona mo'ljalini kiriting",
						Markup.inlineKeyboard([
							Markup.button.callback("Skip >>", "skip"),
						]).resize()
					);
				});
			}
		});

		bot.action("skip", (ctx) => {
			ctx.editMessageText(
				"Ustaxona mo'ljalini kiriting",
				Markup.inlineKeyboard([
					Markup.button.callback("Keyingisi >>", "skip"),
				]).resize()
			);
		});

		bot.on("text", (msg) => {
			let kasb = msg.message.text;
			if (kasb == "🔙 Ortga") {
				ctx.replyWithHTML(
					"👋 <b>Assalomu alaykum XUSH KELIBSIZ</b>\n\n<i>🏆 Botdan foydalanish uchun avval ro'yxatdan o'ting !!!</i>",
					Markup.keyboard([["👉 Ro'yxatdan o'tish"]]).resize()
				);
			} else if (kasblar.includes(kasb)) {
				userOne = { ...userOne, kasb };
				ctx.sendMessage(
					"🥺 Iltimos, contactingizni biz bilan ulashing 🙏",
					Markup.keyboard([
						[Markup.button.contactRequest("☎ Contactni ulashish")],
						["🔙 Ortga"],
					]).resize()
				);
			} else if (!userOne["ustaxonaNomi"]) {
				let ustaxonaNomi = msg.message.text;
				userOne = { ...userOne, ustaxonaNomi };
				ctx.reply(
					"🏘 Ustaxona mo'ljalini kiriting : ",
					Markup.inlineKeyboard([
						Markup.button.callback("Skip >>", "skip"),
					]).resize()
				);
			} else if (!userOne["moljal"]) {
				let moljal = msg.message.text;
				userOne = { ...userOne, moljal };
				ctx.reply("⏰ Ishingizni boshlash vaqti (e.g 8:30) : ");
			} else if (!userOne["boshlanishi"]) {
				let boshlanishi = msg.message.text;
				let [hour, min] = boshlanishi.split(":");
				if (hour && min && hour < 24 && min < 60) {
					userOne = { ...userOne, boshlanishi };
					ctx.reply("🕰 Ishingizni tugash vaqti : ");
				} else {
					ctx.replyWithHTML(
						"<i>Vaqtni to'g'ri yozishda adashdingiz kiritmadingiz</i> 😊\n\n⏰ Ishni boshlash vaqtingiz (e.g 8:30) : "
					);
				}
			} else if (!userOne["mijozVaqti"]) {
				let mijozVaqti = msg.message.text.trim();
				if (mijozVaqti > 0 && mijozVaqti < 60) {
					userOne = { ...userOne, mijozVaqti };
					ctx.replyWithHTML("");
				} else {
					ctx.replyWithHTML(
						"<i>Vaqtni to'g'ri yozishda adashdingiz kiritmadingiz</i> 😊\n\n⏰ Ishni boshlash vaqtingiz (e.g 8:30) : "
					);
				}
			}
		});
	} catch (error) {
		console.log(error);
		ctx.sendMessage("XATOLIK ❌❌❌");
	}
});

bot.launch();
