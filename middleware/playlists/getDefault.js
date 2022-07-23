const { Playlists } = require("../../models/playlists");

module.exports = async (req, res) => {
    try {
        const playlists = await Playlists.find({ userId: req.user._id, isDefault: true })
            .lean();
        if (playlists.length === 0)
            //create default playlist
            playlists.push(await Playlists.create({
                name: "Playlist por defecto",
                isDefault: true,
                userId: req.user._id,
                description: "Playlist por defecto creada automáticamente"
            }))

        res.status(200).send({ playlists });
    } catch (e) {
        res.status(500).send({ success: false, error: e });
    }
}