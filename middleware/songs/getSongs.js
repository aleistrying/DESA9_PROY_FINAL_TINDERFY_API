const { Songs } = require("../../models/songs");

module.exports = async (req, res) => {
    try {
        const songs = await Songs.find();
        if (songs.length)
            res.status(200).send({ success: true, songs });
        else
            res.status(200).send({ success: false, error: "No hay canciones" });
    } catch (e) {
        console.log({ e })
        res.status(200).send({
            success: false,
            error: e
        });
    }
}