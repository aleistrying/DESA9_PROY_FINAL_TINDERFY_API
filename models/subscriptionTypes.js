const mongoose = require("mongoose")
const subscriptionTypesSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    benefits: [String],
    maxSwipes: Number,
    image: String,//maybe
    // category: String,//maybe
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
subscriptionTypesSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
const SubscriptionTypes = mongoose.model("subscription-types", subscriptionTypesSchema);

module.exports = { SubscriptionTypes }