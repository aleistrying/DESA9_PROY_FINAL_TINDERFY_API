const router = require("express").Router();
const { isAdmin, checkToken } = require("../middleware/auth");
const { likeSong, getLikedSongs, dislikeSong } = require("../middleware/users");
const { createSong, getSongs, deleteSong, updateSong, getNextRandomSong } = require("../middleware/songs");

// Create song
router.post("/", checkToken, isAdmin, createSong);

//ADMIN 

// Get all songs
router.get("/", checkToken, getSongs);

// Update song
router.put("/:id", checkToken, isAdmin, updateSong);

// Delete song by ID
router.delete("/:id", checkToken, isAdmin, deleteSong);


//USER

//get random song
router.get("/nextRandom", checkToken, getNextRandomSong);

// Like song
router.put("/like/:id", checkToken, likeSong);
router.put("/dislike/:id", checkToken, dislikeSong);

// Get liked songs
router.get("/like", checkToken, getLikedSongs);

module.exports = router;