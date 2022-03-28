const router = require("express").Router();
const controller = require("../controllers");

router.get("/", controller.wordle.getWordleBank);

module.exports = router;
