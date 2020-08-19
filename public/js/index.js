var socket;
var game;

function configureSockets() {
    socket = io();
    socket.on("tweet", (tweet) => {
        // console.log(tweet);
    })
}

function configureGame() {
    game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    });
}

function preload() {
    this.load.image('marco', '../img/marco.png');
    this.load.image('cerveza', '../img/cerveza.png');
}

var burbujas = [];
var burbujasContainer;
var cantidadBurbujasEfecto = 35;
function create() {

    this.cameras.main.setBackgroundColor('#F9D628');

    var containerWidth = 300;
    var containerHeight = 400;

    var ubicacionX = 168;
    var ubicacionY = 500;

    // el fondo de la cerveza seria esto., y deberia ir creciendo (o subiendo)
    // this.water = this.add.graphics();
    // this.water.fillStyle(0x1155ae)
    //     .fillRect(0, 0, containerWidth, containerHeight);
    this.cerveza = this.add.image(ubicacionX, ubicacionY + 40, 'cerveza').setOrigin(0);

    for (let i = 0; i < cantidadBurbujasEfecto; i++) {
        const burbuja = this.add.graphics(containerWidth / 2, containerHeight / 3);

        cr = containerWidth / 9

        burbuja
            .setPosition(
                (containerWidth / cantidadBurbujasEfecto * i) + ubicacionX,
                (containerHeight / 6 * (Math.random() * 0.05 + 0.95)) + ubicacionY
            )
            .fillStyle(0xffffff, 0.85)
            .fillRoundedRect(-containerWidth / 8, -containerWidth / 8, containerWidth / 4, containerWidth / 4, { tl: cr, tr: cr, bl: cr, br: cr })

        burbuja.rang = Phaser.Math.Between(0, 360);
        burbuja.rangrate = Phaser.Math.Between(10, 20);
        burbujas.push(burbuja)
    }

    burbujasContainer = this.add.container().add(burbujas)


    // crea el marco
    this.add.image(0, 0, 'marco').setOrigin(0);
}

function update() {
    for (key in burbujas) {
        let burbuja = burbujas[key]
        burbuja.setAngle(burbuja.rang + ((Date.now() / burbuja.rangrate) % 360))
    }

    // this.cerveza.y -= 0.2;
    // burbujasContainer.y -= 0.2;
}

// init
configureGame();
configureSockets();