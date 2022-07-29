module.exports = (req, res) => {
    try {
        const user = req.user;
        // user.populate("subscription");
        const {
            _id, name, email,
            lastname, subscription, gender,
            birthday, likedSongs, permissions,
            dailySongsRequested, songLimit, } = user;
        console.log("sending user")
        res.status(200).json({
            success: true, user: {
                _id, name, email,
                lastname, subscription, gender,
                birthday, likedSongs, permissions,
                dailySongsRequested, songLimit,
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            error: "Error de servidor"
        })
    }
}