import * as express from "express";
const router = express.Router();
import {
  createComparedLetters,
  getWordleBank,
  getWordleWord,
} from "../controllers/wordle";

router.get("/words", getWordleBank);
router.get("/word", getWordleWord);
router.post("/word", createComparedLetters);

export default router;
