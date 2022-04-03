import * as express from "express";
const router = express.Router();
import {
  createCheckedLetter,
  getWordleBank,
  getWordleWord,
} from "../controllers/wordle";

router.get("/words", getWordleBank);
router.get("/word", getWordleWord);
router.post("/word", createCheckedLetter);

export default router;
