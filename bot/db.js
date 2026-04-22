const mongoose = require("mongoose");
const { mongoUri } = require("./config");

async function connectDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB ulandi ✅");
  } catch (err) {
    console.error("MongoDB xato ❌", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;