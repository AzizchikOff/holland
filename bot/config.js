require("dotenv").config();

module.exports = {
  token: process.env.BOT_TOKEN,
  adminId: process.env.ADMIN_ID,
  mongoUri: process.env.MONGO_URI,
};