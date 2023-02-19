const { bot } = require("./index");

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

bot.launch();
