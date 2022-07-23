const router = require("express").Router();
const { User } = require("../models/users");
const { Song, validate } = require("../models/songs");
const { isAdmin, checkToken } = require("../middleware/auth");
const { likeSong, getLikedSongs } = require("../middleware/users");
const { createSong, getSongs, deleteSong, updateSong } = require("../middleware/songs");

// Create song
router.post("/", checkToken, isAdmin, createSong);

// Get all songs
router.get("/", checkToken, getSongs);

// Update song
router.put("/:id", checkToken, isAdmin, updateSong);

// Delete song by ID
router.delete("/:id", checkToken, isAdmin, deleteSong);

// Like song
router.put("/like/:id", checkToken, isAdmin, likeSong);

// Get liked songs
router.get("/like", checkToken, getLikedSongs);

module.exports = router;