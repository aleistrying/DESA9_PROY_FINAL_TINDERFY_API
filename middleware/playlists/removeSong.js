module.exports = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.body.playlistId))
        return res.status(400).send({ success: false, error: "Id de playlist invalido" });

    if (!mongoose.Types.ObjectId.isValid(req.body.songId))
        return res.status(400).send({ success: false, error: "Id de playlist invalido" });

    const user = req.user;
    const playlist = await Playlists.find({ _id: mongoose.Types.ObjectId(req.body.playlistId), userId: user._id })
        .select("-__v -userId");
    if (!playlist)
        return res.status(400).send({ success: false, error: "Playlist no encontrada" });


    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).send({ data: playlist, message: "Removed from playlist" });
}