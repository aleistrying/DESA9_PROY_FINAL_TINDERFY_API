const { getMusic } = require("../middleware/music");
const { Songs } = require("../models/songs");

const router = require("express").Router();

router.get("/", getMusic);

//on startup check if any music exists, if not, then add the ones
//that are in the database
(async () => {
    const songs = await Songs.find({})
    if (songs.length === 0)
        Songs.insertMany([{
            "name": "Celest",
            "artist": "Lena Raine",
            "song": "celest.mp3",
            "genre": "pop",
            "image": "https://i.pinimg.com/originals/78/c7/fb/78c7fbff90a40190a8b60a7a500e019e.png",
            "duration": 666,
        }, {

            "name": "Meow",
            "artist": "miau",
            "song": "meow.mp3",
            "genre": "meow",
            "image": "https://assets1.cbsnewsstatic.com/hub/i/r/2011/11/08/b963c3b9-a643-11e2-a3f0-029118418759/thumbnail/620x612/5b303281c581bcbfe4e0f9aff760f77b/Kittenmind_1.jpg",
            "duration": 666,
        }, {

            "name": "We're finally landing",
            "artist": "Home",
            "song": "home-we-are-landing.mp3",
            "genre": "chill",
            "image": "https://t2.genius.com/unsafe/432x432/https%3A%2F%2Fimages.genius.com%2F778c46c4d6be081556756086e801b481.1000x1000x1.jpg",
            "duration": 666,
        }, {

            "name": "One More Time",
            "artist": "Daft Punk",
            "song": "one-more-time.mp3",
            "genre": "EDM",
            "image": "https://upload.wikimedia.org/wikipedia/en/9/99/DaftPunk_OneMoreTime.jpg",
            "duration": 666,
        }, {
            "name": "Lady Hear Me Tonight",
            "artist": "Modjo",
            "song": "lady-hear-me-tonight.mp3",
            "genre": "rock",
            "image": "https://m.media-amazon.com/images/I/51KtHjTesvL._SX466_.jpg",
            "duration": 666,
        }, {
            "name": "Cut my Fingers Off",
            "artist": "Ethan Bortnick",
            "song": "cut-my-fingers-off.mp3",
            "genre": "pop",
            "image": "https://i.scdn.co/image/ab67616d0000b27368caac183f1fb5f7ff1e4311",
            "duration": 666,
        }]).then(() => {
            console.log("Music added");
        }).catch(err => {
            console.log("error inserting music first time", err);
        });
})()

module.exports = router;