//implementation of tinderfy. the tinder of music. backend 
require("dotenv").config()
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
//routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const subscriptionTypeRoutes = require("./routes/subscriptionType");
const subscriptionRoutes = require("./routes/subscription");
const searchRoutes = require("./routes/search");
const paymentRoutes = require("./routes/payment");

const {
    PORT,
    MONGODB_DB,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_PORT
} = config;

const mongoDb = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;
console.log(mongoDb);
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const db = mongoose.connection;
        console.log("connected to mongoDB");
        // db.on("error", console.error.bind(console, "connection error:"));
        // db.on(, (connection) => {
        // console.log(db, "connected")

        //main
        app.use(cors())
        app.use(express.json());


        app.use("/api/pay", paymentRoutes)
        app.use("/api/songs", songRoutes)
        app.use("/api/users", userRoutes)
        app.use("/api/auth", authRoutes)
        app.use("/api/playlists", playlistRoutes)
        app.use("/api/search", searchRoutes)
        app.use("/api/subscriptions", subscriptionRoutes)
        app.use("/api/subscription-types", subscriptionTypeRoutes)

        app.listen(PORT, () => {
            console.log("listening on port: " + PORT);
        })
    })
    .catch(err => {
        console.log("error al iniciar", err);
    })
// })