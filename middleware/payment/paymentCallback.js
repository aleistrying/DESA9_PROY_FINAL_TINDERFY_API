const { Subscriptions } = require("../../models/Subscriptions");
const { Users } = require("../../models/users");
const crypto = require("crypto");
const { FRONTEND_URL, PUB_RSA_KEY } = require("../../config");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    const { query, body } = req
    console.log({ query })
    try {
        if (query["Estado"] === "Denegada") {
            console.log("redirecting to failure url:", `${FRONTEND_URL}/payment/failure?${new URLSearchParams(query)}`)
            return res.redirect(`${FRONTEND_URL}/payment/failure?${new URLSearchParams(query)}`)
        }

        // return res.status(200).json({ success: false, error: "El pago negado, volver a intentar con otra tarjeta o agregar fondos porfavor." })

        //get user
        const user = await Users.findOne({
            paymentToken: query.TOKEN.toLowerCase()
        });

        if (!user)
            return res.status(400).json({ success: false, error: "El token ya no es valido." })
        // try{

        const subscriptionTypeId = crypto.publicDecrypt(PUB_RSA_KEY, Buffer.from(query.SUB_ID.toLowerCase(), "hex"))
            .toString()
            .replace(query.TOKEN.toLowerCase(), "")
        // } catch (e) {
        //     console.log(e)
        //     return res.status(400).json({ success: false, error: "El token ya no es valido o tipo de subscripción." })
        // }
        if (!mongoose.Types.ObjectId.isValid(subscriptionTypeId))
            return res.status(400).json({ success: false, error: "Tipo de subscripcion no valido o tipo de subscripción." })

        //find subscription
        const subscription = await Subscriptions.findOne({
            userId: user._id,
            isActive: true,
        })

        if (subscription)
            return res.status(400).json({ success: false, error: "El usuario ya tiene una subscripcion" })

        user.paymentToken = null;
        // await user.save();

        delete query.CCLW;
        delete query.SUB_ID;
        delete query.TOKEN;
        //create subscription
        const newSubscription = await Subscriptions.create({
            subscriptionTypeId,
            userId: user._id,
            isActive: true,
            paymentInfo: query,
        })
        newSubscription.__v = undefined;

        // return res.status(200).json({ success: true, subscription: newSubscription })
        console.log("redirecting to success url:", `${FRONTEND_URL}/payment/success?${new URLSearchParams(query)}`)
        return res.redirect(`${FRONTEND_URL}/payment/success?${new URLSearchParams(newSubscription)}`)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ success: false, error: "Error al crear una subscripcion" })
    }
}
