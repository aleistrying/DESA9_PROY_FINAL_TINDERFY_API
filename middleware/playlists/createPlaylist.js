const { Playlists, validate } = require("../../models/playlists");

module.exports = async (req, res) => {

    const validationRes = validate(req.body);
    if (!validationRes.success)
        return res.status(400).send({ message: error.details[0].message });

    const playList = await Playlists({
        name: req.body.name,
        description: req.body.description,
        // songs: []//default none.
        image: req.body.image,//prob change this.
        isDefault: String(req.body.isDefault) === "true",

        userId: req.user._id
    }).save();
    user.playlists.push(playList._id);
    await user.save();

    res.status(201).send({ data: playList });
}