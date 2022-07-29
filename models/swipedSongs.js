const mongoose = require("mongoose")

const swipedSongsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "songs",
        required: true,
    },
    type: {
        type: String,
        enum: ["like", "dislike"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = { SwipedSongs: mongoose.model("swiped-songs", swipedSongsSchema) }