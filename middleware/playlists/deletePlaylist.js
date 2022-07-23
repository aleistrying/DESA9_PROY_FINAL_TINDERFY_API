const { Playlists } = require("../../models/playlists");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).send({ success: false, error: "Id invalido" });

        const playlist = await Playlists.findById(req.params.id);
        if (!playlist)
            return res.json({ success: false, error: "Playlist no encontrada" });

        await playlist.remove();

        res.send({ success: true });
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false, error: "Error borrando playlist" });
    }
}