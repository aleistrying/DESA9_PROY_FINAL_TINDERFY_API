const { checkToken } = require("../middleware/auth")
const { SubscriptionTypes } = require("../models/subscriptionTypes")
const { getSubscriptionTypes,
    createSubscriptionType } = require("../middleware/subscriptionTypes")

const router = require("express").Router()

//get subscription types
router.get("/", checkToken, getSubscriptionTypes)

// create a subscription type
router.post("/", checkToken, createSubscriptionType);

(async () => {
    const subscriptionType = await SubscriptionTypes.find({})
    if (subscriptionType.length === 0)
        SubscriptionTypes.create({
            "name": "El Roba dinero",
            "price": 19.99,
            "description": "Aqui es donde recibimos dinero por basicamente ninguna ventaja para ti",
            "benefits": [
                "test"
            ],
            "maxSwipes": 15,
            "image": "lmao",
        }).then(() => {
            console.log("created subscription type")
        }).catch(err => {
            console.log("first time creating subscirption type error", err)
        })
})()
module.exports = router;