const Kasb = require("./models/Kasb");
const User = require("./models/User");
const { Telegraf, Markup } = require("telegraf");
const mongoose = require("mongoose");
const bot = new Telegraf(process.env.BOT_TOKEN);

let services;

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
		let kasbs = await Kasb.find();
		let btns = kasbs.map((k) => [k.name]);
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

bot.hears("Mijoz", (ctx) => {
	// actions on mijoz command
	ctx.sendMessage(
		`Iltimos kontaktingizni ulashing! 🙂\nIsmingizni o'zgartirish uchun qayta hozir qayta ismingizni yozishingiz mumkin.`,
		Markup.keyboard([Markup.button.contactRequest("Kontakt ulashish")]).resize()
	);
	bot.on("contact", async (ctx) => {
		// actions on contact input
		let phoneNumber = ctx.update.message.contact;
		user.phone = phoneNumber.phone_number;

		ctx.replyWithHTML(
			"Mijoz sifatida ro'yxatdan o'tish uchun ismingizni kiriting\n<i>Namuna:</i> Ozodbek\n\n<i>Sizga 'usta'lar qanday murojaat qilishlarini istaysiz?</i>",
			Markup.keyboard([["🔙 Orqaga"]]).resize()
		);

		console.log(user);
		bot.hears("Xizmatlar", (ctx) => {
			// actions on Xizmatlar command
			ctx.replyWithHTML(
				`<b>Xizmatlardan birini o'z ehtiyojingizga qarab tanlang!</b>`,
				Markup.keyboard(services).resize()
			);

			bot.on("message", (ctx) => {
				// actions on on One of the Xizmatlar command
				let text = ctx.update.message.text;
				for (let i = 0; i < services.length; i++) {
					if (services[i] === text) {
						Markup.keyboard([["Ismi"], ["Reyting"], ["Lokatsiya"]]);
					}
				}
			});
			bot.on("message", async (ctx) => {
				// actions on mijoz's name input
				let mijozName = ctx.message.text;
				user.name = mijozName;
				await User.create({
					chatId: ctx.update.message.chat.id,
					...user,
				});

				ctx.sendMessage(
					"Endi botdan mijoz sifatida to'liq foydalanishingiz mumkin. 😃",
					Markup.keyboard([
						["Xizmatlar", "Tanlangan Xizmatlar"],
						["Ma'lumotlarni o'zgartirish"],
					]).resize()
				);
			});
		});

		// bot.hears("Boshqa", (ctx) => {
		//     // actions on Boshqa command
		// });
	});

	// bot.hears(); orqaga
});

bot.command("admin", async (ctx) => {
	menu = 1;
	userChatId = ctx.update.message.chat.id;
	let admin = await User.findOne({ chatId: userChatId });
	if (!admin) {
		return ctx.reply("Siz admin emassiz");
	}
	if (admin.chatId == userChatId && admin.role == "admin") {
		ctx.replyWithHTML(
			`<b>O‘zingizga zarur bandni tanlang</b>`,
			Markup.keyboard([["Xizmatlar", "Ustalar", "Mijozlar"]]).resize()
		);
	} else {
		ctx.reply("Siz admi/n emassiz");
	}
});
bot.hears("/admin", async (ctx) => {
	if (action == "Back to Menu") {
		action = "";
		ctx.replyWithHTML(
			"<b>Zarur xizmat turini tanlang</b>",
			Markup.keyboard([
				["➕ Boshqa xizmat qo'shish"],
				...services.map((s) => [s.name]),
				["🔙 Ortga"],
			]).resize()
		);
	}

	bot.command("quit", async (ctx) => {
		await ctx.telegram.leaveChat(ctx.message.chat.id);

		await ctx.leaveChat();
	});

	bot.hears("Xizmatlar", async (ctx) => {
		menu = 2;
		services = await Kasb.find();
		console.log(services);
		ctx.replyWithHTML(
			"<b>Zarur xizmat turini tanlang</b>",
			Markup.keyboard([
				["➕ Boshqa xizmat qo'shish"],
				...services.map((s) => [s.name]),
				["🔙 Ortga"],
			]).resize()
		);
		return;
	});

	bot.hears("➕ Boshqa xizmat qo'shish", (ctx) => {
		menu = 3;
		ctx.replyWithHTML(
			"<b>Qo'shmoqchi bo'lgan xizmat nomini kiriting...</b>",
			Markup.keyboard([["🔙 Ortga"]]).resize()
		);
		bot.on("message", async (ctx) => {
			let text = ctx.message.text;
			await Kasb.create({ name: text });
			ctx.replyWithHTML(
				"<b>Zarur xizmat turini tanlang</b>",
				Markup.keyboard([
					["➕ Boshqa xizmat qo'shish"],
					...services.map((s) => [s.name]),
					["🔙 Ortga"],
				]).resize()
			);
			action = "Back to Menu";
			return console.log("Created");
		});
	});

	bot.hears("Tahrirlash", (ctx) => {
		action = "editing";
		ctx.replyWithHTML("<b>🙏🏻Iltimos, yangi nomni kiriting✏️</b>");
	});

	bot.hears("Ustalar", (ctx) => {
		ctx.reply("Ustalar");
	});

	bot.hears("Mijozlar", async (ctx) => {
		clients = await User.find();
		console.log(clients);
		ctx.replyWithHTML(
			"<b>Zarur xizmat turini tanlang</b>",
			Markup.keyboard([...clients.map((s) => [s.name]), ["🔙 Ortga"]]).resize()
		);
	});
});

bot.launch();
