const { Users } = require("../../models/users");
const bcrypt = require("bcrypt");
module.exports = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password)
            return res.status(400).json({ success: false, error: "Faltan datos" });

        const user = await Users.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).json({ success: false, message: "Correo o password Invalido" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).json({ success: false, message: "Correo o password Invalido" });

        const token = user.generateAuthToken();
        res.status(200).json({ success: true, token });
    } catch (err) {
        res.status(400).json({ success: false, message: "Correo o password Invalido." });
    }
}