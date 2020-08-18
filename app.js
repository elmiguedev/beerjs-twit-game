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

// declare config functions
function configureRoutes() {
    app.use(express.static('public'));
    app.get("/test", (req, res) => {
        res.send("test");
    });
}

function configureSocket() {
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
}



function configureRules() {
    const stream = twit.stream('statuses/filter', { track: '#Javascript' });
    stream.on("tweet", (tweet) => {
        io.emit("tweet", getTweetInfo(tweet));
        // console.log(getTweetInfo(tweet));
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
    configureSocket();

    // run server
    server.listen(process.env.PORT, function () {
        configureRules();
        console.log(`Listening on ${server.address().port}`);
    });
}

// call main function
startServer();
