// get environment variables
require("dotenv").config();

// import http and express
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// configure twit
const Twit = require("twit");
const twit = new Twit({
    consumer_key: process.env.TWIT_CONSUMER_KEY,
    consumer_secret: process.env.TWIT_CONSUMER_SECRET,
    access_token: process.env.TWIT_ACCESS_TOKEN,
    access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});

const streams = {
    stream_1: null,
    stream_2: null
}

// declare config functions
function configureRoutes() {
    app.use(express.static('public'));
    app.get("/test", (req, res) => {
        res.send("test");
    });
    app.get("/stop", (req, res) => {
        streams.stream_1.stop();
        streams.stream_2.stop();
        res.send("stopped");
    });
}

function configureSocket() {
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
}

function configureRules() {

    console.log("configurando twitter");

    const claves = {
        // player1: "#beerjscba",
        // player2: "@beerjscba"
        player1: "#DevMusic",
        player2: "#devmusic"
    }

    streams.stream_1 = twit.stream('statuses/filter', { track: claves.player1 });
    streams.stream_1.on("tweet", (tweet) => {
        console.log('TWEET', tweet);
        io.emit("tweet_player_1", getTweetInfo(tweet));
    });

    streams.stream_2 = twit.stream('statuses/filter', { track: claves.player2 });
    streams.stream_2.on("tweet", (tweet) => {
        console.log('TWEET', tweet);
        io.emit("tweet_player_2", getTweetInfo(tweet));
    });

}

function getTweetInfo(tweet) {
    return {
        text: tweet.text,
        user: tweet.user.name,
        screenName: tweet.user.screen_name
    };
}

// declare main function
function startServer() {

    configureRoutes();


    // run server
    server.listen(process.env.PORT, function () {
        console.log(`Listening on ${server.address().port}`);
        configureSocket();
        configureRules();
    });
}

// call main function
startServer();
