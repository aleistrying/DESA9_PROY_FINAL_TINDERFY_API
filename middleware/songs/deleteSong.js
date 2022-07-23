const { Songs } = require("../../models/songs");

module.exports = async (req, res) => {
    try {
        const song = await Songs.findById(req.params.id);
        if (!song) return res.status(400).send({ success: false, error: "Cancion no existe" });

        const delRes = await song.remove();
        if (delRes.deletedCount > 0)
            return res.status(200).send({ success: true });
        else
            return res.status(400).send({ success: false, error: "No se pudo eliminar el usuario" });
    } catch (e) {
        console.log(e);
        res.status(400).send({ success: false, error: e });
    }
}