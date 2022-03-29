import { Schema, model } from "mongoose";

interface Wordle {
  wordle: string[];
}

const wordleSchema = new Schema<Wordle>({
  wordle: {
    type: [String],
  },
});

const Wordle = model<Wordle>("Wordle", wordleSchema);

module.exports = Wordle;
