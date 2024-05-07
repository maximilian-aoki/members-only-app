require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connection.on("connected", () => console.log("connected MongoDB"));
mongoose.connection.on("error", () => console.log("error at MongoDB"));
mongoose.connection.on("disconnected", () =>
  console.log("disconnected MongoDB")
);

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_DEV_URI);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectMongo;
