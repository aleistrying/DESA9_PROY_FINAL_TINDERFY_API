const { Playlists } = require("../../models/playlists");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.playlistId))
            return res.status(400).send({ success: false, error: "Id de playlist invalido" });

        if (!mongoose.Types.ObjectId.isValid(req.body.songId))
            return res.status(400).send({ success: false, error: "Id de playlist invalido" });

        const user = req.user;
        const playlist = await Playlists.find({ _id: mongoose.Types.ObjectId(req.body.playlistId), userId: user._id })
            .select("-__v -userId");
        if (!playlist)
            return res.status(400).send({ success: false, error: "Playlist no encontrada" });

        if (playlist.songs.indexOf(req.body.songId) === -1)
            playlist.songs.push(req.body.songId);
        else
            return res.status(400).send({ success: false, error: "La cancion ya esta en la playlist" });

        await playlist.save();
        res.status(200).send({ playlist });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false, error: e });
    }
}