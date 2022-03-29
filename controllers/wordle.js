// import createKeyDate from "../utils/createKeyDate";
"use strict";
const createKeyDate = require("../utils/createKeyDate");
const db = require("../models");
const fs = require("fs");

const writeFileAsync = (content) => {
  const data = JSON.stringify(content);
  fs.writeFile("./data/word.json", data, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

const getWordleBank = (req, res) => {
  let word = "";
  const data = JSON.parse(fs.readFileSync("./data/words.json", "utf8"));

  res.send({ message: data });
};

const getWordleWord = (req, res) => {
  const keyDate = createKeyDate("word");
  const objFile = fs.readFileSync("./data/word.json", "utf8");

  if (objFile.length === 0) {
    const content = {};
    const data = JSON.parse(fs.readFileSync("./data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${keyDate}`] = getRandWord;
    writeFileAsync(content);
    console.log(content, "new");
  } else if (!(`${keyDate}` in JSON.parse(objFile))) {
    const content = {};
    const data = JSON.parse(fs.readFileSync("./data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${keyDate}`] = getRandWord;
    writeFileAsync(content);
  }

  const currentWordJSON = JSON.parse(
    fs.readFileSync("./data/word.json", "utf8")
  );
  const content = currentWordJSON[`${keyDate}`];

  console.log(content, "wordExist");
  res.send({ data: content });
};

module.exports = { getWordleBank, getWordleWord };

// function fileReader(filePath: string, callback: Function) {
//   fs.readFile(filePath, (err: string, fileData) => {
//   if (err) {
//   return callback && callback(err);
//   }
//   try {
//   const object = JSON.parse(fileData);
//   return callback && callback(null, object);
//   } catch (err) {
//   return callback && callback(err);
//   }

//   function for writing to file
//   const writeTextToFileAsync = async (content) => {
//   await fs.writeFile('./data/word.json', content, (err) => {
//   console.log(content)
//   if(err) {
//   console.log(err)
//   } else {
//   console.log('Done writing to file')

// app.get("/word", (req: Request, res: Response) => {
//   fileReader("./data/word.json", (err: string, fileData) => {
//     const key = getLocalStorageKey("word");

//     const solution = fileData.hasOwnProperty(key);

//     console.log(solution);

//     if (solution === false) {
//       const newWord =
//         words[Math.floor(Math.random() * words.length)].toUpperCase();

//       res.send(newWord);

//       const newObj = `{"${key}" : "${newWord}"}`;

//       writeTextToFileAsync(newObj);

//       console.log(newObj);

//       console.log(newWord);
//     } else {
//       res.send({ message: fileData[key] });

//       console.log({ message: fileData[key] });
//     }

//     if (err) {
//       console.log("Error reading file:", err);

//       return;
//     }
//   });
// });
