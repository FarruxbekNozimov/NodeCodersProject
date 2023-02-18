require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    // actions on start command
    ctx.sendMessage(
        "Assalomu aleykum\nBotdan foydalanish uchun avval ro'yxatdan o'ting",
        Markup.keyboard([["Ro'yxatdan o'tish"]]).resize()
    );
});

bot.hears("Ro'yxatdan o'tish", (ctx) => {
    // actions on Ro'yxatdan o'tish command
    ctx.sendMessage(
        "Ro'yxatdan o'tish uchun o'z rolingizni tanlang 👌",
        Markup.keyboard([["Usta", "Mijoz"]]).resize()
    );
});

bot.hears("mijoz", (ctx) => {
    // actions on mijoz command
    ctx.replyWithHTML(
        "Mijoz sifatida ro'yxartdan o'tish uchun ismingizni kiriting\nNamuna: Ozodbek\n<b>Sizni 'usta'lar shu ismingiz bilan tanishadi</b>"
    );
    bot.on("message", (ctx) => {
        // actions on mijoz's name input
    });
});

bot.launch();
