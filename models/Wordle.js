const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wordleSchema = new Schema({
  wordle: {
    type: [String],
  },
});

const Wordle = mongoose.model("Wordle", wordleSchema);

module.exports = Wordle;
