require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const Kasb = require("./models/Kasb");
const User = require("./models/User");

let services;
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

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
