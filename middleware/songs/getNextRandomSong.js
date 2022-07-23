const { Songs } = require("../../models/songs");
const { Subscriptions } = require("../../models/Subscriptions");
const { SwipedSongs } = require("../../models/swipedSongs");
module.exports = async (req, res) => {
    try {
        //find if user has a subscription
        const subscription = await Subscriptions.findOne({
            userId: req.user._id,
            isActive: true,
        }).populate("subscriptionTypeId");
        // console.log(req.user.dailySongsRequested >= req.user.songLimit,
        //     req.user.dailySongsRequested >= subscription.subscriptionTypeId.maxSwipes,
        //     {
        //         dailySongsRequested: req.user.dailySongsRequested,
        //         songLimit: req.user.songLimit,
        //         maxSwipes: subscription.maxSwipes,

        //     })
        if (!subscription) {
            if (req.user.dailySongsRequested >= req.user.songLimit)
                return res.status(200).send({ success: false, error: "Has llegado al limite de canciones que puedes escuchar en tu plan. Compra premium si quieres continuar", pay: true });
        } else if (req.user.dailySongsRequested >= subscription.subscriptionTypeId.maxSwipes)
            return res.status(200).send({ success: false, error: "Has llegado al limite de canciones que puedes escuchar en tu plan. Compra premium++ si quieres continuar", pay: true });

        const swipedSongs = await SwipedSongs.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 }).lean();

        const songs = await Songs.find({
            _id: { $nin: swipedSongs.map(swipe => swipe.songId) },
        });

        if (songs.length === 0)
            return res.status(200).send({ success: false, error: "No hay nuevas canciones disponibles para tí" });

        const song = songs[Math.floor(Math.random() * songs.length)];

        req.user.dailySongsRequested = req.user.dailySongsRequested + 1;
        await req.user.save()

        //one song is shown then we add it to the swipewd list
        await SwipedSongs.create({
            userId: req.user._id,
            songId: song._id,
        });

        res.status(200).send({ success: true, song });

        if (!songs.length)
            res.status(200).send({ success: false, error: "No hay canciones" });
    } catch (e) {
        console.log({ e })
        res.status(200).send({
            success: false,
            error: e
        });
    }
}