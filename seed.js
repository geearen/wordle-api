const db = require("./models");
const data = require("./words.json");

db.Wordle.deleteMany({}, (err, deletedWordle) => {
  db.Wordle.create(data.wordle, (err, seedWordle) => {
    if (err) console.log(err);

    console.log(data.wordle, "wordle of words created successfully");

    process.exit();
  });
});
