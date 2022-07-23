const Subscriptions = require("../../models/Subscriptions");
const SubscriptionTypes = require("../../models/SubscriptionTypes");
const axios = requiere("axios");
const { PAGUELOFACIL_CCLW } = require("../../config/paguelofacil");
const { createTestScheduler } = require("jest");

module.exports = async (req, res) => {

    try {
        //validate
        if (!Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ success: false, error: "subscriptionTypeId is invalid" })

        //check if it exists
        const subscriptionType = await SubscriptionTypes.findById(req.params.id)
        if (!subscriptionType)
            return res.status(400).json({ success: false, error: "subscriptionType not found" })

        //get user
        const user = req.user;

        //find subscription
        const subscription = await Subscriptions.findOne({
            userId: user._id,
            // subscriptionTypeId: req.params.subscriptionTypeId,
            isActive: true,
        })

        if (subscription)
            return res.status(400).json({ success: false, error: "El usuario ya tiene una subscripción" })

        const userToken = crypto.randomBytes(32).toString("hex");
        req.user.paymentToken = userToken;
        await req.user.save();

        const paymentInfo = {
            CCLW: PAGUELOFACIL_CCLW,
            CMTN: subscriptionType.price,
            CDSC: "Compra de " + subscriptionType.name,
            CTAX: subscriptionType.price * 0.07,
            RETURN_URL: Buffer.from("http://localhost:3000/payment/callback").toString("hex"),
            PARM_1: userToken,
        }
        //create link with pagelofacil
        // const link = await paguelofacil.createLink(PAGUELOFACIL_CCLW);
        try {
            const link = await axios.post(`${PAGUELOFACIL_URL}/LinkDeamon.cfm`, paymentInfo)
            res.json({ success: true, link: link.data })
        } catch (e) {
            console.log(e);
            res.status(400).json({ success: false, error: "Error al crear un enlace de pago" })
        }
    } catch (e) {
        console.log(e)
        return res.status(400).json({ success: false, error: "Error al buscar una subscripción" })
    }



}