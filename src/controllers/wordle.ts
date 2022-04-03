// import createKeyDate from "../utils/createKeyDate";
import { Request, Response, NextFunction } from "express";

import createKeyDate from "../utils/createKeyDate";
import fs from "fs";
import WORDLES from "../data/words.json";

const wordDateKey: string = createKeyDate("word");

const writeFileAsync = async (content: object) => {
  const data = JSON.stringify(content);
  console.log(data);
  await fs.writeFile("./src/data/word.json", data, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Written complete");
    }
  });
};

function grabWordleOfDay() {
  let objFile = fs.readFileSync("./src/data/word.json", "utf8");

  if (objFile.length === 0) {
    let content: { [key: string]: string } = {};

    const data = JSON.parse(fs.readFileSync("./src/data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${wordDateKey}`] = getRandWord;
    writeFileAsync(content);
    console.log(content, "new");
  } else if (!(`${wordDateKey}` in JSON.parse(objFile))) {
    let content: { [key: string]: string } = {};

    const data = JSON.parse(fs.readFileSync("./src/data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${wordDateKey}`] = getRandWord;
    writeFileAsync(content);
  }
}

const getWordleBank = (req: Request, res: Response) => {
  const data = JSON.parse(fs.readFileSync("./src/data/words.json", "utf8"));

  res.send({ message: data });
};

const getWordleWord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await grabWordleOfDay();
    const currentWordJSON = await JSON.parse(
      fs.readFileSync("./src/data/word.json", "utf8")
    );
    const content = await currentWordJSON[`${wordDateKey}`];

    console.log(content, "wordExist");
    res.send({ data: content });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
  next();
};

const compareUserToWordleWord = (word: string) => {
  grabWordleOfDay();

  let wordArr: string[] = [...word];
  console.log(wordArr);
  let colorArr: string[] = [];
  let currentWordJSON: wordJSONobj = JSON.parse(
    fs.readFileSync("./src/data/word.json", "utf8")
  );

  let wordOftheDay: string[] = [...currentWordJSON[wordDateKey].toUpperCase()];
  console.log(wordOftheDay, "here");

  wordOftheDay.forEach((char, index) => {
    console.log(char, index, wordArr[index]);
    if (char === word[index]) {
      colorArr.push("correct");
    } else if (wordOftheDay.includes(wordArr[index])) {
      colorArr.push("present");
    } else {
      colorArr.push("absent");
    }
  });

  return colorArr;
};

const checkWordBank = (word: string) => {
  console.log(word);
  if (WORDLES.includes(word.toLowerCase())) {
    return true;
  }
  return false;
};

//post
const createCheckedLetter = async (req: Request, res: Response) => {
  try {
    const enteredGuess = req.body;
    console.log(enteredGuess, "entered");
    const isWordExist = await checkWordBank(enteredGuess.guess);
    if (isWordExist) {
      const compared = compareUserToWordleWord(enteredGuess.guess);
      res.send({ message: compared });
    }

    res.send({ message: false });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};

interface wordJSONobj {
  [key: string]: string;
}

export { getWordleBank, getWordleWord, createCheckedLetter };

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
// const writeTextToFileAsync = async (content) => {
// await fs.writeFile('./data/word.json', content, (err) => {
// console.log(content)
// if(err) {
// console.log(err)
// } else {
// console.log('Done writing to file')
// }

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
