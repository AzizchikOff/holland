require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const bot = new TelegramBot(process.env.BOT_TOKEN);
const ADMIN_ID = Number(process.env.ADMIN_ID);

app.use(cors());
app.use(express.json());

// ── SQLite ─────────────────────────────────
const db = new Database(path.join(__dirname, "holland.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    address    TEXT NOT NULL,
    note       TEXT DEFAULT '',
    gps_lat    REAL,
    gps_lng    REAL,
    items      TEXT NOT NULL,
    total      INTEGER NOT NULL,
    status     TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  
  CREATE TABLE IF NOT EXISTS users (
    user_id       INTEGER PRIMARY KEY,
    username      TEXT,
    first_name    TEXT,
    last_name     TEXT,
    language_code TEXT,
    registered_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    last_active   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
`);

// ── Helpers ────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat("uz-UZ").format(n);
}

const STATUS = {
  new: "🆕 Yangi",
  accepted: "✅ Qabul qilindi",
  cooking: "🍳 Tayyorlanmoqda",
  delivered: "🚀 Yetkazildi",
  cancelled: "❌ Bekor qilindi",
};

function adminKb(id) {
  return {
    inline_keyboard: [
      [
        { text: "✅ Qabul", callback_data: `s_${id}_accepted` },
        { text: "🍳 Tayyorlanmoqda", callback_data: `s_${id}_cooking` },
      ],
      [
        { text: "🚀 Yetkazildi", callback_data: `s_${id}_delivered` },
        { text: "❌ Bekor", callback_data: `s_${id}_cancelled` },
      ],
    ],
  };
}

// Bot start komandasida interaktiv xabar
async function sendWelcomeMessage(chatId) {
  const stats = getBotStats();
  
  const welcomeText = `
🍔 *HOLLAND - Fast Food Buyurtma Boti* 🍟

👋 Assalomu alaykim! Bizning botimizga xush kelibsiz!

📊 *Bot statistikasi:*
  • Foydalanuvchilar: ${fmt(stats.totalUsers)} ta
  • Buyurtmalar: ${fmt(stats.totalOrders)} ta
  • Jami daromad: ${fmt(stats.totalRevenue)} so'm

🎯 *Bizdan nima kutish mumkin?*
  ✅ Tez va qulay buyurtma berish
  ✅ 10-15 daqiqada yetkazib berish
  ✅ Yangi va halol mahsulotlar
  ✅ Arzon narxlar va chegirmalar

📍 *Ishlaydigan joylar:*
  • Toshkent shahar, markaziy qism

💡 *Buyurtma berish uchun:*
  1️⃣ /menu - Menu'ni ko'ring
  2️⃣ Savatga mahsulot qo'shing
  3️⃣ /order - Buyurtmani yuboring

🎁 *Birinchi buyurtmangizga -5% chegirma!*

Keling, boshlaymiz! 👇
  `;

  const welcomeKeyboard = {
    inline_keyboard: [
      [
        { text: "🍕 Menu'ni ko'rish", callback_data: "show_menu" },
        { text: "🛒 Buyurtma berish", callback_data: "start_order" },
      ],
      [
        { text: "📍 Joylashuv", callback_data: "show_location" },
        { text: "ℹ️ Biz haqimizda", callback_data: "show_about" },
      ],
    ],
  };

  await bot.sendMessage(chatId, welcomeText, {
    parse_mode: "Markdown",
    reply_markup: welcomeKeyboard,
  });
}

// Bot statistikasi
function getBotStats() {
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE status != 'cancelled'").get().sum;
  
  return { totalUsers, totalOrders, totalRevenue };
}

// User qo'shish yoki yangilash
function upsertUser(user) {
  const stmt = db.prepare(`
    INSERT INTO users (user_id, username, first_name, last_name, language_code)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      username = excluded.username,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      last_active = datetime('now','localtime')
  `);
  stmt.run(user.id, user.username || null, user.first_name || null, user.last_name || null, user.language_code || null);
}

// ── ROUTES ─────────────────────────────────

// Bot statistikasi API
app.get("/api/stats", (req, res) => {
  try {
    const stats = getBotStats();
    const recentOrders = db.prepare(`
      SELECT o.*, u.first_name, u.username 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.user_id 
      ORDER BY o.created_at DESC 
      LIMIT 10
    `).all();
    
    res.json({
      success: true,
      data: {
        totalUsers: stats.totalUsers,
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        recentOrders: recentOrders.map(o => ({
          ...o,
          items: JSON.parse(o.items),
          user_name: o.first_name || o.username || o.user_id
        }))
      }
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// Buyurtma yaratish
app.post("/api/orders", async (req, res) => {
  try {
    const { userId, name, phone, address, note, gps, items, total } = req.body;
    if (!name || !phone || !address || !items?.length)
      return res.json({ success: false, error: "Ma'lumotlar to'liq emas" });

    const r = db
      .prepare(
        `
      INSERT INTO orders (user_id,name,phone,address,note,gps_lat,gps_lng,items,total)
      VALUES (?,?,?,?,?,?,?,?,?)
    `,
      )
      .run(
        userId,
        name,
        phone,
        address,
        note || "",
        gps?.lat || null,
        gps?.lng || null,
        JSON.stringify(items),
        total,
      );

    const order = db
      .prepare("SELECT * FROM orders WHERE id=?")
      .get(r.lastInsertRowid);
    const pItems = JSON.parse(order.items);

    // Admin xabar
    if (ADMIN_ID) {
      let txt = `🛎 *Yangi buyurtma #${order.id}*\n\n`;
      txt += `👤 ${order.name}\n`;
      txt += `📞 ${order.phone}\n`;
      txt += `📍 ${order.address}\n`;
      if (order.gps_lat)
        txt += `🗺 [Xaritada ko'rish](https://maps.google.com/?q=${order.gps_lat},${order.gps_lng})\n`;
      if (order.note) txt += `💬 ${order.note}\n`;
      txt += `\n📦 *Tarkibi:*\n`;
      pItems.forEach((i) => {
        txt += `• ${i.name} × ${i.qty} = ${fmt(i.price * i.qty)} so'm\n`;
      });
      txt += `\n💰 *Jami: ${fmt(order.total)} so'm*`;
      await bot.sendMessage(ADMIN_ID, txt, {
        parse_mode: "Markdown",
        reply_markup: adminKb(order.id),
      });
    }
    res.json({ success: true, orderId: order.id });
  } catch (e) {
    console.error(e);
    res.json({ success: false, error: e.message });
  }
});

// Foydalanuvchi buyurtmalari
app.get("/api/orders/user/:uid", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC LIMIT 30")
      .all(req.params.uid);
    res.json(rows);
  } catch {
    res.json([]);
  }
});

// Barcha buyurtmalar (admin)
app.get("/api/orders", (req, res) => {
  try {
    res.json(
      db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 100").all(),
    );
  } catch {
    res.json([]);
  }
});

// Health
app.get("/", (req, res) => res.json({ ok: true, service: "Holland API ✅" }));

// ── Bot callback (admin holat yangilash) ───
bot.on("callback_query", async (q) => {
  if (!q.data.startsWith("s_")) return;
  if (q.message.chat.id !== ADMIN_ID) return;

  const [, idStr, status] = q.data.split("_");
  const id = Number(idStr);
  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
  const order = db.prepare("SELECT * FROM orders WHERE id=?").get(id);
  if (!order) return;

  await bot.answerCallbackQuery(q.id, { text: STATUS[status] || status });
  await bot.editMessageReplyMarkup(adminKb(id), {
    chat_id: ADMIN_ID,
    message_id: q.message.message_id,
  });
  await bot.sendMessage(ADMIN_ID, `✅ *#${order.id}* → *${STATUS[status]}*`, {
    parse_mode: "Markdown",
  });

  // Mijozga xabar
  try {
    await bot.sendMessage(
      order.user_id,
      `🔔 *Buyurtma #${order.id}*\n\nHolat: *${STATUS[status]}*\n\nRahmat! 🙏`,
      { parse_mode: "Markdown" },
    );
  } catch {}
});

bot.startPolling();

// ✅ /start komandasi - interaktiv welcome xabar
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  
  // User'ni database'ga qo'shish/yaxshilash
  upsertUser(user);
  
  // Interaktiv welcome xabar yuborish
  sendWelcomeMessage(chatId).catch(err => {
    console.error("Welcome xabar yuborishda xatolik:", err);
  });
});

// ✅ Mini App callback'lar - interaktiv tugmalar
bot.on("callback_query", async (q) => {
  // Admin holat yangilash
  if (q.data.startsWith("s_")) {
    if (!q.message.chat.id === ADMIN_ID) return;
    
    const [, idStr, status] = q.data.split("_");
    const id = Number(idStr);
    db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
    const order = db.prepare("SELECT * FROM orders WHERE id=?").get(id);
    if (!order) return;

    await bot.answerCallbackQuery(q.id, { text: STATUS[status] || status });
    await bot.editMessageReplyMarkup(adminKb(id), {
      chat_id: ADMIN_ID,
      message_id: q.message.message_id,
    });
    await bot.sendMessage(ADMIN_ID, `✅ *#${order.id}* → *${STATUS[status]}*`, {
      parse_mode: "Markdown",
    });

    // Mijozga xabar
    try {
      await bot.sendMessage(
        order.user_id,
        `🔔 *Buyurtma #${order.id}*\n\nHolat: *${STATUS[status]}*\n\nRahmat! 🙏`,
        { parse_mode: "Markdown" },
      );
    } catch {}
    return;
  }
  
  // Mini App callback'larga javob
  if (q.data === "show_menu") {
    await bot.answerCallbackQuery(q.id, { text: "Menu sahifasiga o'tilmoqda..." });
    // Mini App URL'ini ochish
    try {
      await bot.sendMessage(q.message.chat.id, "🌐 Menu sahifasi ochilmoqda...", {
        reply_markup: {
          web_app: { url: "https://your-domain.com/menu" }
        }
      });
    } catch (e) {
      // Fallback - oddiy xabar
      await bot.sendMessage(q.message.chat.id, "Menu uchun: https://your-domain.com/menu");
    }
  }
  
  if (q.data === "start_order") {
    await bot.answerCallbackQuery(q.id, { text: "Buyurtma jarayoni boshlandi!" });
    await bot.sendMessage(q.message.chat.id, "🛒 Buyurtma berish uchun: https://your-domain.com/order");
  }
  
  if (q.data === "show_location") {
    await bot.answerCallbackQuery(q.id);
    await bot.sendMessage(q.message.chat.id, 
      "📍 *Ish joylarimiz:*\n\n" +
      "🏢 Toshkent shahar, Amir Temur ko'chasi 15\n" +
      "🏬 Savdo markazi ichida\n\n" +
      "⏰ Ish vaqti: 08:00 - 23:00",
      { parse_mode: "Markdown" }
    );
  }
  
  if (q.data === "show_about") {
    await bot.answerCallbackQuery(q.id);
    await bot.sendMessage(q.message.chat.id,
      "🍔 *HOLLAND Fast Food*\n\n" +
      "Biz 2020-yildan beri xizmat ko'rsatmoqdamiz.\n\n" +
      "✅ Yangi va halol mahsulotlar\n" +
      "✅ Tez yetkazib berish (10-15 daqiqa)\n" +
      "✅ Arzon narxlar\n" +
      "✅ Yuqori sifat\n\n" +
      "📞 Tel: +998 (90) 699 95 95\n" +
      "🌐 Web: holland.uz",
      { parse_mode: "Markdown" }
    );
  }
});

app.listen(PORT, () => console.log(`✅ Holland API: http://localhost:${PORT}`));
