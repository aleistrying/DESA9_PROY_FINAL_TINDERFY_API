const mongoose = require("mongoose");
const { Playlists } = require("../../models/playlists");
const { Songs } = require("../../models/songs");
const { SwipedSongs } = require("../../models/swipedSongs");
const { Users } = require("../../models/users");

module.exports = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({ success: false, error: "No se ha especificado un id valido" });

    try {
        const song = await Songs.findById(req.params.id);
        if (!song) return res.status(400).send({ success: false, error: "La canción no existe" });

        //if exists on swipedsongs then send error
        const swipedSong = await SwipedSongs.findOne({
            userId: req.user._id,
            songId: song._id,
        });
        if (swipedSong) return res.status(400).send({ success: false, error: "Ya has escuchado esta canción" });

        //one song is shown then we add it to the swipewd list
        await SwipedSongs.create({
            userId: req.user._id,
            songId: song._id,
            type: "dislike",
        });

        res.status(200).send({ success: true });
    } catch (e) {
        console.log(e);
        res.status(400).send({ success: false, error: e });
    }
}