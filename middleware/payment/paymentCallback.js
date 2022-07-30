const { Subscriptions } = require("../../models/subscriptions");
const { SubscriptionTypes } = require("../../models/subscriptionTypes");
const { Users } = require("../../models/users");
const crypto = require("crypto");
const { FRONTEND_URL, PRIVATE_KEY, SUPER_SECRET } = require("../../config");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    const { query, body } = req
    console.log({ query })
    try {

        //validate hash
        const verificationHash = crypto.createHmac("sha256", String(SUPER_SECRET))
            .update(query.UID + query.SID)
            .digest("hex");
        //find user with hash
        // const user = await Users.findOne({
        //     paymentToken: verificationHash,
        // })
        // if(!user)
        //     return res.status(400).json({   
        //         success: false,
        //         error: "Usuario no encontrado"
        //     })

        if (!crypto.timingSafeEqual(Buffer.from(verificationHash, "hex"), Buffer.from(query.HASH, "hex"))) {
            return res.status(400).json({
                success: false,
                error: "Algo salio mal"
            })
        }
        //check object ids
        if (!mongoose.Types.ObjectId.isValid(query.UID))
            return res.status(400).json({
                success: false,
                error: "Id de usuario invalido"
            })
        else if (!mongoose.Types.ObjectId.isValid(query.SID))
            return res.status(400).json({
                success: false,
                error: "Id de tipo de subscripcion invalido"
            })


        if (query["Estado"] === "Denegada") {
            console.log("redirecting to failure url:", `${FRONTEND_URL}/payment/failure?${new URLSearchParams(query)}`)
            return res.redirect(`${FRONTEND_URL}/payment/failure?${new URLSearchParams(query)}`)
        }

        // return res.status(200).json({ success: false, error: "El pago negado, volver a intentar con otra tarjeta o agregar fondos porfavor." })

        //get user
        const user = await Users.findById(query.UID)
        if (!user)
            return res.status(400).json({ success: false, error: "El token ya no es valido." })
        // try{



        // const subscriptionTypeId = crypto.publicDecrypt(PUB_RSA_KEY, Buffer.from(query.SUB_ID.toLowerCase(), "hex"))
        //     .toString()
        //     .replace(query.TOKEN.toLowerCase(), "")
        // } catch (e) {
        //     console.log(e)
        //     return res.status(400).json({ success: false, error: "El token ya no es valido o tipo de subscripción." })
        // }
        // if (!mongoose.Types.ObjectId.isValid(query.SID))
        //     return res.status(400).json({ success: false, error: "Tipo de subscripcion no valido o tipo de subscripción." })

        //find subscription type if it exists
        const subscriptionType = await SubscriptionTypes.findById(query.SID)
        if (!subscriptionType)
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
        delete query.UID;
        delete query.SID;
        delete query.HASH;

        //create subscription
        const newSubscription = await Subscriptions.create({
            subscriptionTypeId: subscriptionType._id,
            userId: user._id,
            isActive: true,
            paymentInfo: query,
        })
        newSubscription.__v = undefined;

        // return res.status(200).json({ success: true, subscription: newSubscription })
        console.log("redirecting to success url:", `${FRONTEND_URL}/payment/success?${new URLSearchParams(query)}`)
        return res.redirect(`${FRONTEND_URL}/payment/success?${new URLSearchParams(query)}`)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ success: false, error: "Error al crear una subscripcion" })
    }
}
