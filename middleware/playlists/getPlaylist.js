const mongoose = require("mongoose");
const { Playlists } = require("../../models/playlists");
module.exports = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).send({ success: false, error: "Id invalido" });

        const playlist = await Playlists.findById(req.params.id)
            .populate("songs");
        if (!playlist)
            return res.status(404).json("not found");
        // const songs = await Song.find({ _id: playlist.songs });
        res.status(200).send({ playlist, songs: playlist.songs });
    } catch (e) {
        console.log(e);
    }
}