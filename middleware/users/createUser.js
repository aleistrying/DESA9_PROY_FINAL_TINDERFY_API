const bcrypt = require("bcrypt");
const { Users, validate } = require("../../models/users");

module.exports = async (req, res) => {
    const validationResponse = validate(req.body);
    if (!validationResponse.success) return res.status(400).send(validationResponse);

    const user = await Users.findOne({ email: req.body.email });
    if (user)
        return res
            .status(403)
            .send({ success: false, error: "El usuario ya existe!" });

    const hashPassword = await bcrypt.hash(req.body.password, 12);
    try {
        // let newUser =
        await Users.create({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            // age: req.body.age,
            gender: req.body.gender,
            birthday: new Date(req.body.birthday),

            password: hashPassword,
        })
    } catch (e) {
        console.log(e);
        return res.status(500)
            .json({ success: false, error: String(e) })
    }

    // newUser.password = undefined;
    // newUser.__v = undefined;

    res.json({ success: true });
}