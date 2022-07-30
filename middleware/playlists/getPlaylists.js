const { Playlists } = require("../../models/playlists");

module.exports = async (req, res) => {
    try {

        const playlists = await Playlists.find();
        if (!playlists)
            return res.json({ success: false, error: "No hay playlists" });

        res.json({ playlists });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ success: false, error: "Error al obtener las playlists" });
    }
}