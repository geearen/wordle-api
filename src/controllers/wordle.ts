// import createKeyDate from "../utils/createKeyDate";
import { Request, Response, NextFunction } from "express";

import createKeyDate from "../utils/createKeyDate";
import fs, { write } from "fs";
import WORDLES from "../data/words.json";

const wordDateKey: string = createKeyDate("word");

const writeFileAsync = (content: object) => {
  const data = JSON.stringify(content);
  console.log(data);
  fs.writeFile("./src/data/word.json", data, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Written complete");
    }
  });
};

async function grabWordleOfDay() {
  let objFile = fs.readFileSync("./src/data/word.json", "utf8");

  if (objFile.length === 0) {
    let content: { [key: string]: string } = {};

    const data = JSON.parse(fs.readFileSync("./src/data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${wordDateKey}`] = getRandWord;
    await writeFileAsync(content);
    console.log(content, "new");
  } else if (!(`${wordDateKey}` in JSON.parse(objFile))) {
    let content: { [key: string]: string } = {};

    const data = JSON.parse(fs.readFileSync("./src/data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${wordDateKey}`] = getRandWord;
    writeFileAsync(content);
  }
}

const compareUserToWordleWord = async (
  word: string,
  userAgent: string | undefined
) => {
  await grabWordleOfDay();

  let wordArr: string[] = [...word];
  console.log(wordArr);
  let charPosition: charPositionCheckerObj = {
    green: [],
    yellow: [],
    gray: [],
    positionChecked: [],
    wordExist: true,
  };
  let currentWordJSON: wordJSONobj = {};

  if (userAgent === "cypress") {
    currentWordJSON = { [wordDateKey]: "adieu" };
  } else {
    currentWordJSON = JSON.parse(
      fs.readFileSync("./src/data/word.json", "utf8")
    );
  }

  let wordOftheDay: string[] = [...currentWordJSON[wordDateKey].toUpperCase()];
  console.log(wordOftheDay, "here");

  wordOftheDay.forEach((char, index) => {
    console.log(char, index, wordArr[index]);
    if (char === wordArr[index]) {
      charPosition.green.push(wordArr[index]);
      charPosition.positionChecked.push("correct");
    } else if (wordOftheDay.includes(wordArr[index])) {
      charPosition.yellow.push(wordArr[index]);
      charPosition.positionChecked.push("present");
    } else {
      charPosition.gray.push(wordArr[index]);
      charPosition.positionChecked.push("absent");
    }
  });

  return Promise.resolve(charPosition);
};

const checkWordBank = (word: string) => {
  console.log(word);
  if (WORDLES.includes(word.toLowerCase())) {
    return true;
  }
  return false;
};

const getWordleBank = (req: Request, res: Response) => {
  const data = JSON.parse(fs.readFileSync("./src/data/words.json", "utf8"));

  return res.send({ message: data });
};

const getWordleWord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    grabWordleOfDay();
    const currentWordJSON = await JSON.parse(
      fs.readFileSync("./src/data/word.json", "utf8")
    );
    const content = await currentWordJSON[`${wordDateKey}`];

    console.log(content, "wordExist");
    res.status(200).json({ data: content });
  } catch (e) {
    console.log(e);
    res.redirect("/api/word");
    next();
  }
};

//post
const createCheckedLetter = async (req: Request, res: Response) => {
  try {
    const reqHeadersUserAgent = req.headers["user-agent"];
    console.log(req.headers["user-agent"]);
    const enteredGuess = req.body;
    console.log(enteredGuess, "entered");
    const isWordExist = checkWordBank(enteredGuess.guess);
    let charPosition: charPositionCheckerObj = {
      green: [],
      yellow: [],
      gray: [],
      positionChecked: [],
      wordExist: false,
    };
    if (isWordExist) {
      charPosition = await compareUserToWordleWord(
        enteredGuess.guess,
        reqHeadersUserAgent
      );
      console.log(charPosition);
      res.send({ message: charPosition });
    } else {
      res.send({ message: charPosition });
    }
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};

interface wordJSONobj {
  [key: string]: string;
}

interface charPositionCheckerObj {
  green: string[];
  yellow: string[];
  gray: string[];
  positionChecked: string[];
  wordExist?: boolean;
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
