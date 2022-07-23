const express = require("express")
const { checkToken } = require("../middleware/auth")
const router = express.Router()
const { createPaymentLink, paymentCallback } = require("../middleware/payment")

router.post("/subscription-types/:id", checkToken, createPaymentLink)
router.get("/callback", paymentCallback)

// router.get("/:subscriptionTypeId", loggedIn)

module.exports = router;
