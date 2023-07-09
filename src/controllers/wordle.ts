// import createKeyDate from "../utils/createKeyDate";
import { Request, Response, NextFunction } from "express";

import createKeyDate from "../utils/createKeyDate";
import path from "path";
import fs, { write } from "fs";
import WORDLES from "../data/words.json";
import { json } from "stream/consumers";

const wordDateKey: string = createKeyDate("word");
const jsonDirectory = path.join(process.cwd());

/* Mediator / Controller - behavioral design pattern that reduces connections between components of a program by making them communicate indirectly, through a special mediator object

in context of MVC - 
- a controller accepts input and converts it to commands for the model and view
- controller responds to the user input and performs interactions on the data model object. 

ex: real-world-analogy 
  - Air Traffic Controller (ATC)
    Pilots doesnt communicate directly with each other - instead they talk to the ATC. Without ATC pilots need to be aware of every plane around them and pilots will has to decide who gets to land first. 
    
    A car - The accelerator, brake, clutch, steering, gear stick, light controllers, windshield wiper controller, which communicates to the model (engine, wheel, transmission, ).  then model will updates the view (speedometer, indicators, fuel gauge, RPM gauge)
*/

//HTTP verbs / HTTP request methods
//get
const getWordleBank = (req: Request, res: Response) => {
  const data = JSON.parse(fs.readFileSync(jsonDirectory + "/src/data/words.json", "utf8"));
  return res.send({ message: data });
};

//get
const getWordleWord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    grabWordleOfDay();
    const currentWordJSON = await JSON.parse(
      fs.readFileSync(jsonDirectory + "/tmp/word.json", "utf8")
    );
    const content = currentWordJSON[`${wordDateKey}`];

    res.status(200).json({ data: content });
  } catch (e) {
    console.log(e);
    res.redirect("/api/word");
    next();
  }
};

//post
const createComparedLetters = async (req: Request, res: Response) => {
  try {
    const reqHeadersUserAgent = req.headers["user-agent"];
    const enteredGuess = req.body;
    let charPosition: charPositionCheckerObj = {
      green: [],
      yellow: [],
      gray: [],
      positionChecked: [],
      wordExist: false,
    };
    const isWordExist = checkWordBank(enteredGuess.guess);

    if (isWordExist) {
      charPosition = await compareUserToWordleWord(
        enteredGuess.guess,
        reqHeadersUserAgent
      );
      res.send({ message: charPosition });
    } else {
      res.send({ message: charPosition });
    }
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};

//Command - behavioral pattern that converts requests or simple operations into objects

const writeFileAsync = (content: object) => {
  const data = JSON.stringify(content);
  console.log(data);
  fs.writeFile(jsonDirectory + "/tmp/word.json", data, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Written complete");
    }
  });
};

async function grabWordleOfDay() {
  let objFile = fs.readFileSync(jsonDirectory +  "/tmp/word.json", "utf8");

  if (objFile.length === 0) {
    let content: { [key: string]: string } = {};

    const data = JSON.parse(fs.readFileSync(jsonDirectory +  "/src/data/words.json", "utf8"));
    const getRandWord = data[Math.floor(Math.random() * data.length)];
    content[`${wordDateKey}`] = getRandWord;
    await writeFileAsync(content);
    console.log(content, "new");
  } else if (!(`${wordDateKey}` in JSON.parse(objFile))) {
    let content: { [key: string]: string } = {};

    const data = JSON.parse(fs.readFileSync(jsonDirectory + "/src/data/words.json", "utf8"));
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
      fs.readFileSync(jsonDirectory + "/tmp/word.json", "utf8")
    );
  }

  let wordOftheDay: string[] = [...currentWordJSON[wordDateKey].toUpperCase()];

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
  if (WORDLES.includes(word.toLowerCase())) {
    return true;
  }
  return false;
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

export { getWordleBank, getWordleWord, createComparedLetters };
