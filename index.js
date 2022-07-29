//implementation of tinderfy. the tinder of music. backend 
require("dotenv").config()
const config = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const nodeSchedule = require("node-schedule");
//routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const songRoutes = require("./routes/song");
const musicRoutes = require("./routes/music");
const playlistRoutes = require("./routes/playlist");
const subscriptionTypeRoutes = require("./routes/subscriptionType");
const subscriptionRoutes = require("./routes/subscription");
const searchRoutes = require("./routes/search");
const paymentRoutes = require("./routes/payment");
const { Users } = require("./models/users");

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

        // Enable CORS
        app.use(express.json());
        app.use((req, res, next) => {
            //log every route name
            // console.log(req.url)
            next();
        })


        app.use("/api/pay", paymentRoutes)
        app.use("/api/songs", songRoutes)
        app.use("/api/music", musicRoutes)
        app.use("/api/users", userRoutes)
        app.use("/api/auth", authRoutes)
        app.use("/api/playlists", playlistRoutes)
        app.use("/api/search", searchRoutes)
        app.use("/api/subscriptions", subscriptionRoutes)
        app.use("/api/subscription-types", subscriptionTypeRoutes)

        app.listen(PORT, () => {
            console.log("listening on port: " + PORT);
        })
        //setup a cron to update every user every day at midnight
        nodeSchedule.scheduleJob("0 0 0 * * *", async () => {
            console.log("updating users quota")
            const updatesResults = await Users.updateMany({}, { dailySongsRequested: 0 });
            console.log(updatesResults)
        })

    })
    .catch(err => {
        console.log("error al iniciar", err);
    })
// })