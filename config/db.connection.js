import mongoose from "mongoose";
require("dotenv").config();

const connectionStr =
  process.env.MONGODB_URI || "mongodb://localhost:27017/wordle";

mongoose.connect(connectionStr);

mongoose.connection.on("connected", function () {
  console.log(`${new Date().toLocaleTimeString()} ------ MongoDB Connected`);
});

mongoose.connection.on("error", function (error) {
  console.log(`MongoDB connection error.. `, error);
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB Disconnected.....");
});
