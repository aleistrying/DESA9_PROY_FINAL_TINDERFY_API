const Subscriptions = require("../../models/subscriptions");

module.exports = async (req, res) => {
    try {
        const subscriptions = await Subscriptions.find({})
        if (!subscriptions.length)
            return res.status(404).json({ success: false, error: "No hay subscripciones" })

        res.status(200).json(subscriptions)
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, error: "Error al buscar Subscripciones" })
    }
}