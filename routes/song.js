const router = require("express").Router();
const { isAdmin, checkToken } = require("../middleware/auth");
const { likeSong, getLikedSongs } = require("../middleware/users");
const { createSong, getSongs, deleteSong, updateSong, getNextRandomSong } = require("../middleware/songs");

// Create song
router.post("/", checkToken, isAdmin, createSong);

// Get all songs
router.get("/", checkToken, getSongs);

router.get("/nextRandom", checkToken, getNextRandomSong);

// Update song
router.put("/:id", checkToken, isAdmin, updateSong);

// Delete song by ID
router.delete("/:id", checkToken, isAdmin, deleteSong);

// Like song
router.put("/like/:id", checkToken, isAdmin, likeSong);

// Get liked songs
router.get("/like", checkToken, getLikedSongs);

module.exports = router;