const { Playlists } = require("../../models/playlists");
const { Songs } = require("../../models/songs");

module.exports = async (req, res) => {
    const search = req.query.search;
    if (!search)
        return res.status(400).send({ success: false, error: "No incluyó un parámetro de búsqueda" });
    try {
        const songs = await Songs.find({
            name: { $regex: search, $options: "i" },
        }).limit(10);

        const playlists = await Playlists.find({
            name: { $regex: search, $options: "i" },
        }).limit(10);

        res.status(200).json({ success: true, songs, playlists });

    } catch (e) {
        console.log(e);
        res.status(400).send({
            success: false,
            error: e
        });
    }
}