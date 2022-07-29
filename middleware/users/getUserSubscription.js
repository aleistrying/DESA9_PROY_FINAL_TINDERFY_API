const Subscriptions = require("../../models/subscriptions");

module.exports = (req, res) => {
    try {
        const subscription = Subscriptions.findOne({
            userId: req.user._id,
            isActive: true,
        }).lean();
        if (!subscription)
            return res.status(200).send({ success: false, error: "No tiene subscripcion" });

        return res.status(200).send({ success: true, subscription });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, error: "Error al obtener la subscripcion" })
    }
}