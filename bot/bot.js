const TelegramBot = require("node-telegram-bot-api");
const { token } = require("./config");

const bot = new TelegramBot(token, { polling: true });

// STATE
const userState = {};
const userCart = {};

const menu = [
  { id: 1, name: "Burger", price: 25000 },
  { id: 2, name: "Lavash", price: 30000 },
  { id: 3, name: "Cola", price: 10000 },
];

// START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🍔 Menu:", {
    reply_markup: {
      inline_keyboard: menu.map((item) => [
        {
          text: `${item.name} - ${item.price} so'm`,
          callback_data: `add_${item.id}`,
        },
      ]),
    },
  });
});

// ADD
bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;
  const data = q.data;

  if (data.startsWith("add_")) {
    const id = Number(data.split("_")[1]);
    const item = menu.find((i) => i.id === id);

    if (!userCart[chatId]) userCart[chatId] = [];

    userCart[chatId].push(item);

    bot.answerCallbackQuery(q.id, {
      text: "Qo‘shildi ✅",
    });
  }
});

// CART
bot.onText(/\/cart/, (msg) => {
  const chatId = msg.chat.id;
  const cart = userCart[chatId] || [];

  if (!cart.length) return bot.sendMessage(chatId, "Savat bo‘sh");

  let text = "🛒 Savat:\n\n";
  let total = 0;

  cart.forEach((i) => {
    text += `- ${i.name} (${i.price})\n`;
    total += i.price;
  });

  text += `\nJami: ${total} so'm`;

  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍 Buyurtma berish", callback_data: "checkout" }],
      ],
    },
  });
});

// CHECKOUT
bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;

  if (q.data === "checkout") {
    userState[chatId] = "phone";
    bot.sendMessage(chatId, "📞 Telefoningizni kiriting:");
  }
});

// TEXT FLOW
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (userState[chatId] === "phone") {
    userState[chatId] = "address";
    userCart[chatId].phone = msg.text;

    bot.sendMessage(chatId, "📍 Manzilni kiriting:");
    return;
  }

  if (userState[chatId] === "address") {
    const cart = userCart[chatId];
    cart.address = msg.text;

    let text = "📦 Yangi buyurtma:\n\n";
    let total = 0;

    cart.forEach((i) => {
      text += `- ${i.name}\n`;
      total += i.price;
    });

    text += `\nJami: ${total} so'm`;
    text += `\n📞 ${cart.phone}`;
    text += `\n📍 ${cart.address}`;

    bot.sendMessage(chatId, "✅ Buyurtma yuborildi");

    // ADMINGA YUBORISH
    bot.sendMessage(process.env.ADMIN_ID, text);

    userCart[chatId] = [];
    userState[chatId] = null;
  }
});