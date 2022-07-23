const express = require("express")
const router = express.Router()
const { paySubscription } = require("../middleware/payment")

router.post("/subscriptions-types/:subscriptionTypeId", paySubscription)

// router.get("/:subscriptionTypeId", loggedIn)

module.exports = router;
