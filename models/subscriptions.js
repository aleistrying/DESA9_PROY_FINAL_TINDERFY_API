const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({
    subscriptionTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscription-types",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    isActive: Boolean,
    // startDate: Date,
    // endDate: Date,
    paymentInfo: {
        type: {},
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

//add pre and post save hooks
subscriptionSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = { Subscriptions: mongoose.model("subscriptions", subscriptionSchema) }