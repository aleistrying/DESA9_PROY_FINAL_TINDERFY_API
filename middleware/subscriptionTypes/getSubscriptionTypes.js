const { SubscriptionTypes } = require("../../models/SubscriptionTypes");

module.exports = async (req, res) => {
    try {
        const subscriptionTypes = await SubscriptionTypes.find({})
        if (!subscriptionTypes.length)
            return res.status(400).json({ success: false, error: "No hay tipos de subscripciones" })

        return res.status(200).json({ success: true, subscriptionTypes });
    } catch (e) {
        console.log(e)
        return res.status(400).json({ success: false, error: "Error al crear una subscripcion" })
    }
}