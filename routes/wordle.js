const router = require("express").Router();
const controller = require("../controllers");

router.get("/words", controller.wordle.getWordleBank);
router.get("/word", controller.wordle.getWordleWord);

module.exports = router;
