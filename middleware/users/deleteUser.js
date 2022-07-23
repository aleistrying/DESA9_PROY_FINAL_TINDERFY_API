const { Users } = require("../../models/users");

module.exports = async (req, res) => {
    try {

        const user = await Users.findById(req.params.id);
        if (!user)
            return res.status(400).send({ success: false, error: "Usuario no existe" });

        const delRes = await user.delete();

        if (delRes.deletedCount > 0)
            return res.status(200).send({ success: true });
        else
            return res.status(400).send({ success: false, error: "No se pudo eliminar el usuario" });

    } catch (e) {
        console.log(e);
        res.status(400).send({ success: false, error: "Error al eliminar el usuario" });
    }
}