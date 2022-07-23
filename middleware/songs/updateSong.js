
const mongoose = require("mongoose");
const { Songs, validate } = require("../../models/songs");
module.exports = async (req, res) => {
    //validate id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({ success: false, error: "Id inválido" });
    try {
        const song = await Songs.findById(req.params.id);
        if (song)
            res.status(200).send({ success: true });
        else
            res.status(200).send({ success: false, error: "No encontramos al usuario" });

        let updateObject = {};
        updateObject.name = req.body?.name || song.name
        updateObject.artist = req.body?.artist || song.artist
        updateObject.duration = req.body?.duration || song.duration
        updateObject.image = req.body?.image || song.image
        updateObject.song = req.body?.song || song.song

        const validation = validate(updateObject);
        if (!validation.success)
            return res.json(validation);

        const updateRes = await song.updateOne({ $set: updateObject })
        if (updateRes.nModified > 0)
            return updateRes.status(200).send({ success: true })
        else
            return updateRes.status(200).send({ success: false, error: "No se pudo actualizar la canción" })
    } catch (e) {
        console.log(e)
        res.status(400).send({ success: false, error: "Error al actualizar la canción" });
    }
}