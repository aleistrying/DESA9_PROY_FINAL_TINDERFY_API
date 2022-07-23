const Subscriptions = require("../../models/Subscriptions");
const SubscriptionTypes = require("../../models/SubscriptionTypes");

module.exports = async (req, res) => {
    try {
        //validate
        if (!Types.ObjectId.isValid(req.params.subscriptionTypeId))
            return res.status(400).json({ success: false, error: "subscriptionTypeId is invalid" })

        //check if it exists
        const subscriptionType = await SubscriptionTypes.findById(req.params.subscriptionTypeId)
        if (!subscriptionType)
            return res.status(400).json({ success: false, error: "subscriptionType not found" })

        //get user
        const user = req.user;
        //find subscription
        const subscription = await Subscriptions.findOne({
            userId: user._id,
            subscriptionTypeId: req.params.subscriptionTypeId,
            isActive: true,
        })

        if (subscription)
            return res.status(400).json({ success: false, error: "El usuario ya tiene una subscripcion" })

        //create subscription
        const newSubscription = await Subscriptions.create({
            subscriptionTypeId: req.params.subscriptionTypeId,
            userId: user._id,
            isActive: true,
        })
        newSubscription.__v = undefined;

        return res.status(200).json({ success: true, subscription: newSubscription })
    } catch (e) {
        console.log(e)
        return res.status(400).json({ success: false, error: "Error al crear una subscripcion" })
    }
}
