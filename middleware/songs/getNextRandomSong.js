const { Songs } = require("../../models/songs");
const Subscriptions = require("../../models/Subscriptions");
module.exports = async (req, res) => {
    try {
        //find if user has a subscription
        const subscription = await Subscriptions.findOne({
            userId: req.user._id,
            isActive: true,
        })
        if (!subscription) {
            if (req.user.dailySongsRequested >= req.user.songLimit)
                return res.status(200).send({ success: false, error: "Has llegado al limite de canciones que puedes escuchar en tu plan. Compra premium si quieres continuar", pay: true });
        } else if (req.user.dailySongsRequested >= subscription.maxSwipes)
            return res.status(200).send({ success: false, error: "Has llegado al limite de canciones que puedes escuchar en tu plan. Compra premium++ si quieres continuar", pay: true });

        const songs = await Songs.find();

        const song = songs[Math.floor(Math.random() * songs.length)];

        req.user.dailySongsRequested = req.user.dailySongsRequested + 1;
        await req.user.save()
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