const { Songs } = require("../../models/songs");
const { Users } = require("../../models/users");

module.exports = async (req, res) => {
    try {
        // const user = await Users.findById(req.user._id);
        const user = req.user;
        const songs = await Songs.find({ _id: user.likedSongs }).lean();
        res.status(200).send({ success: true, songs });
    } catch (e) {
        console.log(e);
        res.status(400).send({
            success: false,
            error: e
        });
    }
}