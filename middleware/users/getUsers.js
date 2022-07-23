const { Users } = require('../../models/users');
module.exports = async (req, res) => {
    try {
        const users = await Users.find().select("-password -__v").lean()
        if (users.length)
            res.status(200).send({ success: true, users });
        else
            res.status(200).send({ success: false, error: "No hay usuarios" });
    } catch (e) {
        res.status(400).send({ success: false, error: e });
    }
}