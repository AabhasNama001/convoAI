const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error("MongoDB Connection error", err));
}

module.exports = connectToDB;
