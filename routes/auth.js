const { loginUser } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", loginUser);

module.exports = router;