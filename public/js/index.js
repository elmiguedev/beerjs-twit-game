var socket;
var game;

function configureSockets() {
    socket = io();
    socket.on("tweet", (tweet) => {
        console.log(tweet);
    })
}

function configureGame() {
    game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    });
}

function preload() {

}

function create() {

}

function update() {

}

// init
configureGame();
configureSockets();