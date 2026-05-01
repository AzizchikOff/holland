require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const mongoose    = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");

const app      = express();
const PORT     = process.env.PORT || 3000;
const ADMIN_ID = Number(process.env.ADMIN_ID);
const bot      = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.use(cors());
app.use(express.json());

// ── MongoDB ────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch(e => console.error("❌ MongoDB:", e.message));

const OrderSchema = new mongoose.Schema({
  userId:  Number,
  name:    String,
  phone:   String,
  address: String,
  note:    { type: String, default: "" },
  gpsLat:  Number,
  gpsLng:  Number,
  items:   Array,
  total:   Number,
  status:  { type: String, default: "new" },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  userId:      { type: Number, unique: true },
  username:    String,
  firstName:   String,
  lastName:    String,
  languageCode: String,
  registeredAt: { type: Date, default: Date.now },
  lastActive:   { type: Date, default: Date.now },
  totalOrders:  { type: Number, default: 0 },
  totalSpent:   { type: Number, default: 0 },
});

const Order = mongoose.model("Order", OrderSchema);
const User = mongoose.model("User", UserSchema);

// ── Helpers ────────────────────────────────
function fmt(n) { return new Intl.NumberFormat("uz-UZ").format(n); }

const STATUS = {
  new:       "🆕 Yangi",
  accepted:  "✅ Qabul qilindi",
  cooking:   "🍳 Tayyorlanmoqda",
  delivered: "🚀 Yetkazildi",
  cancelled: "❌ Bekor qilindi",
};

const MENU_URL = "https://holland-namangan.netlify.app/app/";

function adminKb(id) {
  return { inline_keyboard: [
    [{ text: "✅ Qabul",          callback_data: `s_${id}_accepted`  },
     { text: "🍳 Tayyorlanmoqda", callback_data: `s_${id}_cooking`   }],
    [{ text: "🚀 Yetkazildi",     callback_data: `s_${id}_delivered` },
     { text: "❌ Bekor",           callback_data: `s_${id}_cancelled` }],
  ]};
}

// Interaktiv welcome xabar yuborish
async function sendWelcomeMessage(chatId, user) {
  const name = user.firstName || user.username || "Do'stim";
  
  // Statistika olish
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, sum: { $sum: "$total" } } }
  ]);
  const revenue = totalRevenue[0]?.sum || 0;
  
  // Yangi foydalanuvchi bo'lsa maxsus tabrik
  const isNewUser = user.registeredAt && 
    (Date.now() - new Date(user.registeredAt).getTime()) < 3600000;
  
  const welcomeText = 
    `🍔 *HOLLAND - Fast Food Buyurtma Boti* 🍟\n\n` +
    `👋 ${isNewUser ? "Yangi mehmonimizga" : "Bizning botimizga"} xush kelibsiz, *${name}*\\!\n\n` +
    `📊 *Bot statistikasi:*\n` +
    `  • Foydalanuvchilar: *${fmt(totalUsers)}* ta\n` +
    `  • Buyurtmalar: *${fmt(totalOrders)}* ta\n` +
    `  • Jami daromad: *${fmt(revenue)}* so'm\n\n` +
    `🎯 *Bizdan nima kutish mumkin?*\n` +
    `  ✅ Tez va qulay buyurtma berish\n` +
    `  ✅ 10-15 daqiqada yetkazib berish\n` +
    `  ✅ Yangi va halol mahsulotlar\n` +
    `  ✅ Arzon narxlar va chegirmalar\n\n` +
    `📍 *Ishlaydigan joylar:*\n` +
    `  • Namangan shahar, G'alaba ko'chasi 1a\n\n` +
    `💡 *Buyurtma berish uchun:*\n` +
    `  1️⃣ Pastdagi 🍔 tugmasini bosing\n` +
    `  2️⃣ Menu'dan mahsulot tanlang\n` +
    `  3️⃣ Savatga qo'shing va yuboring\n\n` +
    `${isNewUser ? "🎁 *Birinchi buyurtmangizga -5% chegirma!*\\n\\n" : ""}` +
    `Keling, boshlaymiz! 👇`;

  const welcomeKeyboard = {
    inline_keyboard: [
      [
        { text: "🍕 Menu'ni ko'rish", web_app: { url: MENU_URL + "#menu" } },
        { text: "🛒 Buyurtma berish", web_app: { url: MENU_URL + "#order" } },
      ],
      [
        { text: "📦 Buyurtmalarim", callback_data: "my_orders" },
        { text: "📍 Joylashuv", callback_data: "show_location" },
      ],
      [
        { text: "ℹ️ Biz haqimizda", callback_data: "show_about" },
        { text: "📞 Bog'lanish", callback_data: "show_contact" },
      ],
    ],
  };

  await bot.sendMessage(chatId, welcomeText, {
    parse_mode: "MarkdownV2",
    reply_markup: welcomeKeyboard,
  });
}

function mainMenuKb() {
  return {
    keyboard: [
      [{ text: "🍔 Buyurtma berish", web_app: { url: MENU_URL } }],
      [{ text: "📦 Buyurtmalarim" }, { text: "ℹ️ Biz haqimizda" }],
      [{ text: "📞 Bog'lanish" }],
    ],
    resize_keyboard: true,
    persistent: true,
  };
}

// ══════════════════════════════════════════
//  BOT — /start (INTERAKTIV WELCOME)
// ══════════════════════════════════════════
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = {
    userId: msg.from.id,
    username: msg.from.username,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    languageCode: msg.from.language_code,
  };

  // User'ni database'ga saqlash/yaxshilash
  await User.findOneAndUpdate(
    { userId: user.userId },
    { $setOnInsert: user, $set: { lastActive: Date.now() } },
    { upsert: true, new: true }
  );

  // Interaktiv welcome xabar yuborish
  await sendWelcomeMessage(chatId, user);
});

// ══════════════════════════════════════════
//  BOT — Text messages
// ══════════════════════════════════════════
bot.on("message", async (msg) => {
  if (msg.text?.startsWith("/")) return;
  if (msg.web_app_data) return;

  // User activity yangilash
  if (msg.from) {
    await User.findOneAndUpdate(
      { userId: msg.from.id },
      { $set: { lastActive: Date.now() } },
      { upsert: true }
    );
  }

  const id   = msg.chat.id;
  const text = msg.text || "";

  if (text === "📦 Buyurtmalarim") {
    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 }).limit(5);
    if (!orders.length) {
      return bot.sendMessage(id, "📭 Hali buyurtma berilmagan.", { reply_markup: mainMenuKb() });
    }
    let txt = "📦 *So'nggi buyurtmalaringiz:*\n\n";
    orders.forEach(o => {
      txt += `*#${o._id.toString().slice(-6).toUpperCase()}*\n`;
      txt += `Holati: ${STATUS[o.status] || o.status}\n`;
      txt += `Jami: ${fmt(o.total)} so'm\n`;
      txt += `Sana: ${o.createdAt.toLocaleDateString("uz-UZ")}\n\n`;
    });
    return bot.sendMessage(id, txt, { parse_mode: "Markdown", reply_markup: mainMenuKb() });
  }

  if (text === "ℹ️ Biz haqimizda") {
    return bot.sendMessage(id,
      `🏪 *Holland Fast Food*\n\n` +
      `📍 G'alaba ko'chasi 1a, Namangan\n` +
      `⏰ Ish vaqti: 11:00 – 01:00\n` +
      `📞 +998 90 699 95 95\n\n` +
      `Har bir buyurtma yangi tayyorlanadi.\n` +
      `✅ 100% Halol mahsulot`,
      { parse_mode: "Markdown", reply_markup: mainMenuKb() }
    );
  }

  if (text === "📞 Bog'lanish") {
    return bot.sendMessage(id,
      `📞 *Bog'lanish:*\n\n` +
      `Telefon: +998 90 699 95 95\n` +
      `Telegram: @Holland\\_fries\n` +
      `Sayt: holland\\-namangan\\.netlify\\.app`,
      { parse_mode: "MarkdownV2", reply_markup: mainMenuKb() }
    );
  }

  // Tushunilmagan xabar
  return bot.sendMessage(id,
    "Buyurtma berish uchun quyidagi tugmani bosing 👇",
    { reply_markup: mainMenuKb() }
  );
});

// ══════════════════════════════════════════
//  BOT — Admin callback (holat yangilash)
// ══════════════════════════════════════════
bot.on("callback_query", async (q) => {
  // Admin holat yangilash
  if (q.data.startsWith("s_")) {
    if (q.message.chat.id !== ADMIN_ID) return;

    const parts  = q.data.split("_");
    const id     = parts[1];
    const status = parts[2];

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return;

    await bot.answerCallbackQuery(q.id, { text: STATUS[status] || status });
    await bot.editMessageReplyMarkup(adminKb(id), {
      chat_id: ADMIN_ID, message_id: q.message.message_id,
    });
    await bot.sendMessage(ADMIN_ID,
      `✅ *#${id.slice(-6).toUpperCase()}* → *${STATUS[status]}*`,
      { parse_mode: "Markdown" }
    );

    // Mijozga xabar
    try {
      await bot.sendMessage(order.userId,
        `🔔 *Buyurtma holati yangilandi*\n\n${STATUS[status]}\n\nRahmat! 🙏`,
        { parse_mode: "Markdown" }
      );
      
      // User stats yangilash
      await User.findOneAndUpdate(
        { userId: order.userId },
        { $inc: { totalOrders: 1, totalSpent: order.total } },
        { upsert: true }
      );
    } catch {}
    return;
  }

  // Inline keyboard callback'lari
  if (q.data === "my_orders") {
    await bot.answerCallbackQuery(q.id, { text: "Buyurtmalar yuklanmoqda..." });
    const orders = await Order.find({ userId: q.message.chat.id }).sort({ createdAt: -1 }).limit(5);
    if (!orders.length) {
      return bot.sendMessage(q.message.chat.id, "📭 Hali buyurtma berilmagan.");
    }
    let txt = "📦 *So'nggi buyurtmalaringiz:*\n\n";
    orders.forEach(o => {
      txt += `*#${o._id.toString().slice(-6).toUpperCase()}*\n`;
      txt += `Holati: ${STATUS[o.status] || o.status}\n`;
      txt += `Jami: ${fmt(o.total)} so'm\n`;
      txt += `Sana: ${o.createdAt.toLocaleDateString("uz-UZ")}\n\n`;
    });
    await bot.sendMessage(q.message.chat.id, txt, { parse_mode: "Markdown" });
    return;
  }

  if (q.data === "show_location") {
    await bot.answerCallbackQuery(q.id);
    await bot.sendMessage(q.message.chat.id,
      `📍 *Bizning joylashuvimiz:*\n\n` +
      `🏢 Namangan shahar, G'alaba ko'chasi 1a\n` +
      `🏬 Savdo markazi ichida\n\n` +
      `⏰ Ish vaqti: 11:00 – 01:00\n\n` +
      `🗺 Xaritada ko'rish: https://maps.google.com/?q=40.7589,71.6618`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (q.data === "show_about") {
    await bot.answerCallbackQuery(q.id);
    await bot.sendMessage(q.message.chat.id,
      `🏪 *HOLLAND Fast Food*\n\n` +
      `Biz 2020-yildan beri xizmat ko'rsatmoqdamiz.\n\n` +
      `✅ Yangi va halol mahsulotlar\n` +
      `✅ Tez yetkazib berish (10-15 daqiqa)\n` +
      `✅ Arzon narxlar\n` +
      `✅ Yuqori sifat\n\n` +
      `📞 Tel: +998 (90) 699 95 95\n` +
      `🌐 Web: holland-namangan.netlify.app`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (q.data === "show_contact") {
    await bot.answerCallbackQuery(q.id);
    await bot.sendMessage(q.message.chat.id,
      `📞 *Bog'lanish:*\n\n` +
      `📱 Telefon: +998 90 699 95 95\n` +
      `💬 Telegram: @Holland_fries\n` +
      `🌐 Sayt: holland-namangan.netlify.app\n\n` +
      `🕒 Biz bilan bog'lanish vaqti: 09:00 - 22:00`,
      { parse_mode: "Markdown" }
    );
    return;
  }
});

// ══════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════

// Bot statistikasi API
app.get("/api/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, sum: { $sum: "$total" } } }
    ]);
    const revenue = totalRevenue[0]?.sum || 0;
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue: revenue,
        recentOrders: recentOrders.map(o => ({
          ...o,
          items: o.items,
          user_name: o.name
        }))
      }
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// Buyurtma yaratish (Mini App dan)
app.post("/api/orders", async (req, res) => {
  try {
    const { userId, name, phone, address, note, gps, items, total } = req.body;
    if (!name || !phone || !address || !items?.length)
      return res.json({ success: false, error: "Ma'lumotlar to'liq emas" });

    const order = await Order.create({
      userId, name, phone, address,
      note:   note || "",
      gpsLat: gps?.lat || null,
      gpsLng: gps?.lng || null,
      items,  total,
    });

    // User stats yangilash (buyurtma muvaffaqiyatli bo'lganda)
    await User.findOneAndUpdate(
      { userId: userId },
      { $inc: { totalOrders: 1, totalSpent: total } },
      { upsert: true }
    );

    // Adminga xabar
    if (ADMIN_ID) {
      let txt = `🛎 *Yangi buyurtma #${order._id.toString().slice(-6).toUpperCase()}*\n\n`;
      txt += `👤 ${order.name}\n`;
      txt += `📞 ${order.phone}\n`;
      txt += `📍 ${order.address}\n`;
      if (order.gpsLat) txt += `🗺 [Xaritada ko'rish](https://maps.google.com/?q=${order.gpsLat},${order.gpsLng})\n`;
      if (order.note)   txt += `💬 ${order.note}\n`;
      txt += `\n📦 *Tarkibi:*\n`;
      order.items.forEach(i => { txt += `• ${i.name} × ${i.qty} = ${fmt(i.price * i.qty)} so'm\n`; });
      txt += `\n💰 *Jami: ${fmt(order.total)} so'm*`;

      await bot.sendMessage(ADMIN_ID, txt, {
        parse_mode: "Markdown",
        reply_markup: adminKb(order._id.toString()),
      });
    }

    res.json({ success: true, orderId: order._id });
  } catch (e) {
    console.error(e);
    res.json({ success: false, error: e.message });
  }
});

// Foydalanuvchi buyurtmalari
app.get("/api/orders/user/:uid", async (req, res) => {
  try {
    const orders = await Order.find({ userId: Number(req.params.uid) })
      .sort({ createdAt: -1 }).limit(30);
    res.json(orders);
  } catch { res.json([]); }
});

// Barcha buyurtmalar (admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch { res.json([]); }
});

// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "Holland API ✅" }));

// ── Server ─────────────────────────────────
app.listen(PORT, () => console.log(`✅ Holland API: http://localhost:${PORT}`));