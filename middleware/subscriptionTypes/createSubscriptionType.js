
const { SubscriptionTypes } = require("../../models/subscriptionTypes");

module.exports = async (req, res) => {
    try {
        const {
            name, price, description,
            benefits, maxSwipes, image, //category, 
        } = req.body;

        //validate 
        if (!name)
            return res.status(400).json({ success: false, error: "El nombre es requerido" })
        else if (!price)
            return res.status(400).json({ success: false, error: "El precio es requerido" })
        else if (typeof price !== "number")
            return res.status(400).json({ success: false, error: "El precio debe ser un numero" })
        else if (!description)
            return res.status(400).json({ success: false, error: "La descripcion es requerida" })
        else if (!benefits)
            return res.status(400).json({ success: false, error: "Los beneficios son requeridos" })
        else if (benefits.length < 1)
            return res.status(400).json({ success: false, error: "Debes ingresar al menos 1 beneficio" })
        else if (typeof benefits === "object" &&
            !benefits.map(benefit => typeof benefit === "string").reduce((a, b) => a && b, true))
            return res.status(400).json({ success: false, error: "Los beneficios deben ser strings" })
        else if (!maxSwipes)
            return res.status(400).json({ success: false, error: "El numero de swipes es requerido" })
        else if (typeof maxSwipes !== "number")
            return res.status(400).json({ success: false, error: "El numero de swipes debe ser un numero" })
        else if (!image)
            return res.status(400).json({ success: false, error: "La imagen es requerida" })

        const subscriptionType = await SubscriptionTypes.create({
            name, price, description,
            benefits, maxSwipes, image, //category,
        });

        subscriptionType.__v = undefined;

        return res.status(200).json({ success: true, subscriptionType });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            success: false,
            error: "Error al crear una subscripcion"
        })
    }
}