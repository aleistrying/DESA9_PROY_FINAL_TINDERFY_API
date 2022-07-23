const { Playlists, validate } = require("../../models/playlists");

module.exports = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).send({ success: false, error: "Id inválido" });

        const playlist = await Playlists.findOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            userId: req.user._id
        });
        if (!playlist) return res.status(404).send({
            success: false,
            error: "No se encontro esta playlist para editar"
        });

        let updateObject = {};
        updateObject.name = req.body?.name || user.name
        updateObject.description = req.body?.description || user.description
        updateObject.image = req.body?.image || user.image

        const validation = validate(updateObject);
        if (!validation.success)
            return res.json(validation);

        const updateRes = await playlist.updateOne({ $set: updateObject })
        if (updateRes.nModified > 0)
            return updateRes.status(200).send({ success: true })
        else
            return updateRes.status(200).send({ success: false, error: "No se pudo actualizar el playlist del usuario" })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ success: false, error: "Error interno del servidor" });
    }

}