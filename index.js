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

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.on("connection", (connection) => {
    console.log(connection, "connected")

    //main
    app.use(cors())
    app.use(express.json());


    app.use("/pay", paymentRoutes)
    app.use("/songs", songRoutes)
    app.use("/users", userRoutes)
    app.use("/auth", authRoutes)
    app.use("/playlists", playlistRoutes)
    app.use("/search", searchRoutes)

    app.listen(PORT, () => {
        console.log("listening on port: " + PORT);
    })
})