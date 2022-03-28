const db = require("../models");

const getWordleBank = (req, res) => {
  // db.Wordle.find({}, (err, foundWordleBank) => {
  //   if (err) {
  //     console.log("Error in Wordle Bank", err);

  //     return res.send("Incomplete WordleBank controller function");
  //   }

  //   // res.status(200).json({ wordle: foundWordle });
  // });
  res.send({ message: "hello" });
};

module.exports = { getWordleBank };
