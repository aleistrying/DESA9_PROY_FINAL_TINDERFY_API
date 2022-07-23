const { getMusic } = require("../middleware/music");

const router = require("express").Router();

router.get("/", getMusic);

module.exports = router;