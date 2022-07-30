const { Subscriptions } = require("../../models/subscriptions");
const { SubscriptionTypes } = require("../../models/subscriptionTypes");
const mongoose = require("mongoose");
const axios = require("axios");
const crypto = require("crypto")
const { PAGUELOFACIL_CCLW, URL, PAGUELOFACIL_URL, PRI_RSA_KEY, SUPER_SECRET } = require("../../config");

module.exports = async (req, res) => {

    try {
        //validate
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({
                success: false,
                error: "Id de la subscripcion es invalido"
            })

        //check if it exists
        const subscriptionType = await SubscriptionTypes.findById(req.params.id)
        if (!subscriptionType)
            return res.status(400).json({
                success: false,
                error: "El tipo de subscripcion no se encontro"
            })

        //get user
        const user = req.user;

        //find subscription
        const subscription = await Subscriptions.findOne({
            userId: user._id,
            // subscriptionTypeId: req.params.subscriptionTypeId,
            isActive: true,
        })

        if (subscription)
            return res.status(400).json({
                success: false,
                error: "El usuario ya tiene una subscripción"
            })

        // const userToken = crypto.randomBytes(32).toString("hex");
        // req.user.paymentToken = userToken;
        // await req.user.save();
        const verificationHash = crypto.createHmac("sha256", String(SUPER_SECRET))
            .update(user._id + subscriptionType._id)
            .digest("hex");
        req.user.paymentToken = verificationHash;
        await req.user.save();

        const paymentInfo = {
            CCLW: PAGUELOFACIL_CCLW,
            CMTN: subscriptionType.price,
            CDSC: "Compra de " + subscriptionType.name,
            CTAX: Math.round(subscriptionType.price * 0.07 * 100) / 100,
            RETURN_URL: Buffer.from(URL + "/api/pay/callback").toString("hex"),
            // TOKEN: userToken.toLowerCase(),
            UID: user._id,
            SID: subscriptionType._id,
            HASH: verificationHash,
            // SUB_ID: crypto.privateEncrypt(PRI_RSA_KEY, Buffer.from(subscriptionType._id.toString().toLowerCase() + userToken.toLowerCase())).toString("hex").toLowerCase(),
        }
        // console.log(subscriptionType._id.toString().toLowerCase())
        //create link with pagelofacil
        // const link = await paguelofacil.createLink(PAGUELOFACIL_CCLW);
        try {
            const { data } = await axios.post(`${PAGUELOFACIL_URL}/LinkDeamon.cfm?${new URLSearchParams(paymentInfo).toString()}`, paymentInfo)
            if (data.headerStatus.code === 200)
                // return res.redirect(data.data.url)
                return res.json({ success: true, link: data.data.url })

            return res.json({ success: false, error: data.headerStatus.description })
        } catch (e) {
            console.log(e);
            return res.status(400).json({ success: false, error: "Error al crear un enlace de pago" })
        }
    } catch (e) {
        console.log(e)
        return res.status(400).json({ success: false, error: "Error al buscar una subscripción" })
    }

}