const mongoose = require("mongoose");
const { Users, validate } = require("../../models/users");
const bcrypt = require("bcrypt");
module.exports = async (req, res) => {
    //validate id
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({ success: false, error: "Id inválido" });
    try {
        const user = await Users.findById(req.params.id);
        if (user)
            res.status(200).send({ success: true });
        else
            res.status(200).send({ success: false, error: "No encontramos al usuario" });

        let updateObject = {};
        updateObject.name = req.body?.name || user.name
        updateObject.lastname = req.body?.lastname || user.lastname
        updateObject.password = req.body?.password || user.password
        updateObject.gender = req.body?.gender || user.gender
        // updateObject.age = new Date(req.body?.age || user.age)
        updateObject.birthday = new Date(req.body?.birthday || user.birthday)

        const validation = validate(updateObject);
        if (!validation.success)
            return res.json(validation);

        //     //email can't ever be modified
        // updateObject.email = user.email
        //password hashing 
        updateObject.password = await bcrypt.hash(updateObject.password, 12)
        const updateRes = await user.updateOne({ $set: updateObject })
        if (updateRes.nModified > 0)
            return updateRes.status(200).send({ success: true })
        else
            return updateRes.status(200).send({ success: false, error: "No se pudo actualizar el usuario" })
    } catch (e) {
        console.log(e)
        res.status(400).send({ success: false, error: "Error al actualizar el perfil" });
    }
}