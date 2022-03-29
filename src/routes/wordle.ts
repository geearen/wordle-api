import * as express from "express";
const router = express.Router();
import { getWordleBank, getWordleWord } from "../controllers/wordle";

router.get("/words", getWordleBank);
router.get("/word", getWordleWord);

export default router;
