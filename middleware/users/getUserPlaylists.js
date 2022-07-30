const { Playlists } = require("../../models/playlists");
module.exports = async (req, res) => {
    try {
        const playlists = await Playlists.find({
            userId: req.user._id,
        }).populate("songs", "_id name artist genre song image duration");
        console.log(playlists);
        if (!playlists)
            return res.json({ success: false, error: "Usuario no tiene playlists" });

        res.json({ success: true, playlists });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ success: false, error: "Error al obtener las playlists" });
    }
}