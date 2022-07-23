const { V4 } = require('paseto');
const { Users } = require('../../models/users');
const { PUBLIC_KEY } = require("../../config")

module.exports = async (req, res, next) => {
    //check headers for a valid token
    try {
        const token = req.headers.authorization.split(" ")[1];

        const verify = await V4.verify(token, PUBLIC_KEY, {
            maxTokenAge: '1h'
        });

        req.user = await Users.findById(verify.sub)

        if (verify) {
            next();
        } else {
            res.status(401).send({ success: false, error: "No tienes autorización" });
        }
    } catch (e) {
        return res.status(400).send({ success: false, error: "Token Invalido" });
    }

}