const { checkToken } = require("../middleware/auth")
const { getSubscriptionTypes,
    createSubscriptionType } = require("../middleware/subscriptionTypes")

const router = require("express").Router()

//get subscription types
router.get("/", checkToken, getSubscriptionTypes)

// create a subscription type
router.post("/", checkToken, createSubscriptionType)

module.exports = router;