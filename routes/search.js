const router = require("express").Router();
const { checkToken, isAdmin } = require("../middleware/auth");
const { searchSong } = require("../middleware/songs");

router.get("/", checkToken, isAdmin, searchSong);

module.exports = router;