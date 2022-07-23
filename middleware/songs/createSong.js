const { Songs, validate } = require("../../models/songs");
module.exports = async (req, res) => {
    const validateRes = validate(req.body);
    if (!validateRes.success)
        res.status(400).send(validateRes);

    try {
        await Songs.create({
            name: req.body.name,
            artist: req.body.artist,
            song: req.body.song,
            img: req.body.img,
            duration: req.body.duration,
        });
        res.status(201).send({ success: true });
    } catch (e) {
        console.log(e)
        res.status(400).send({ success: false, error: e });
    }
}