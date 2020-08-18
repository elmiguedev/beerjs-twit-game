// get environment variables
require("dotenv").config();

// import http and express
const express = require("express");
const app = express();
const server = require("http").Server(app);

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
    app.get("/", (req, res) => {
        res.send("test");
    });
}


function configureRules() {

}

// declare main function
function startServer() {

    configureRoutes();

    // run server
    server.listen(process.env.PORT, function () {
        console.log(`Listening on ${server.address().port}`);
    });
}

// call main function
startServer();
