const { Users } = require("../../models/users");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    //validate object id
    const id = req.params?.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send({ success: false, error: "Id inválido" });
    try {
        const user = await Users.findById(req.params.id).select({
            _id: 1, name: 1, lastname: 1, email: 1, // password:1,
            // age: 1,
            subscription: 1, gender: 1,
            birthday: 1, likedSongs: 1, permission: 1,
        }).lean()

        if (user)
            res.status(200).send({ success: true, user });
        else
            res.status(200).json({ success: false, error: "Usuario no encontrado" });
    } catch (e) {
        console.log(e);
        res.status(400).send({ success: false, error: "Error al obtener el usuario" });
    }
}