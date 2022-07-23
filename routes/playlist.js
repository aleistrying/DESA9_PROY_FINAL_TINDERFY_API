const router = require("express").Router();
const { checkToken } = require("../middleware/auth");
const { createPlaylist, updatePlaylist, addSong, removeSong,
    getDefault, getPlaylist, getPlaylists, deletePlaylist } = require("../middleware/playlists");

// create playlist
router.post("/", checkToken, createPlaylist);

// edit playlist by id
router.put("/edit/:id", checkToken, updatePlaylist);

// add song to playlist
router.put("/add-song", checkToken, addSong);

// remove song from playlist
router.put("/remove-song", checkToken, removeSong);

// user playlists
router.get("/default", checkToken, getDefault);


// get random playlists
//meh
// router.get("/random", auth, async (req, res) => {
//     const playlists = await PlayList.aggregate([{ $sample: { size: 10 } }]);
//     res.status(200).send({ data: playlists });
// });

// get playlist by id
router.get("/:id", checkToken, getPlaylist);

// get all playlists
router.get("/", checkToken, getPlaylists);

// delete playlist by id
router.delete("/:id", checkToken, deletePlaylist);

module.exports = router;