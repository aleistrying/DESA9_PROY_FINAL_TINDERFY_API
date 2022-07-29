const mongoose = require("mongoose");
const { Playlists } = require("../../models/playlists");
const { Songs } = require("../../models/songs");
const { SwipedSongs } = require("../../models/swipedSongs");
const { Users } = require("../../models/users");

module.exports = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({ success: false, error: "No se ha especificado un id valido" });

    try {
        const song = await Songs.findById(req.params.id);
        if (!song) return res.status(400).send({ success: false, error: "La canción no existe" });

        //one song is shown then we add it to the swipewd list
        await SwipedSongs.create({
            userId: req.user._id,
            songId: song._id,
        });

        // const user = await Users.findById(req.user._id);
        const user = req.user;
        const index = user.likedSongs.indexOf(song._id);
        if (index === -1)
            user.likedSongs.push(song._id);
        else
            user.likedSongs.splice(index, 1);
        await user.save();

        //add to default playlist
        let playlist = await Playlists.findOne({ isDefault: true });
        if (!playlist) {
            //find if user has any other playlist
            playlist = await Playlists.findOne({ userId: req.user._id });
            //set as default if found
            if (playlist)
                playlist.isDefault = true;
            else //create default playlist
                playlist = await Playlists.create({
                    name: "Playlist por defecto",
                    isDefault: true,
                    userId: user._id,
                    description: "Playlist por defecto creada automáticamente"
                });
        }
        playlist.push(song._id);
        await playlist.save();

        res.status(200).send({ success: true });
    } catch (e) {
        console.log(e);
        res.status(400).send({ message: e });
    }
}