var socket;
var game;

/**
 * Inicializa la configuracion del socket que escucha
 * las respuestas de los tweets de la API de twitter
 *  */
function configureSockets() {
    socket = io();
    socket.on("tweet", (tweet) => {
        // console.log(tweet);
    })
}

/**
 * Inicializa la configuracion del juego
 */
function configureGame() {

    // Crea el canvas del juego
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

    // Bucle principal del juego
    // -------------------------------------

    function preload() {
        this.load.image('marco', '../img/marco.png');
        this.load.image('cerveza', '../img/cerveza.png');
    }

    function create() {

        // crea el contenedor de las cervezas
        this.cervezas = {};

        // crea las birritas
        this.cervezas.player1 = crearCerveza(this, 168, 500);
        this.cervezas.player2 = crearCerveza(this, 770, 500);

        // crea el marco del juego
        crearMarco(this);

    }

    function update() {
        this.cervezas.player1.moverBurbujas();
        this.cervezas.player1.subir();
        this.cervezas.player2.moverBurbujas();
        this.cervezas.player2.subir();
    }

    // Metodos del juego
    // --------------------------------

    // crea una cerveza del juego
    function crearCerveza(scene, x, y) {

        // dimensiones de la cerveza
        const containerWidth = 300;
        const containerHeight = 400;
        const cantidadBurbujasEfecto = 35;
        const burbujas = [];

        // crea la cerveza 🍻 (o sea, el liquido xD)
        const cerveza = scene.add.image(x, y + 40, "cerveza").setOrigin(0);

        // crea las burbujas
        for (let i = 0; i < cantidadBurbujasEfecto; i++) {
            const burbuja = scene.add.graphics(containerWidth / 2, containerHeight / 3);
            const cr = containerWidth / 9

            burbuja
                .setPosition(
                    (containerWidth / cantidadBurbujasEfecto * i) + x,
                    (containerHeight / 6 * (Math.random() * 0.05 + 0.95)) + y
                )
                .fillStyle(0xffffff, 0.85)
                .fillRoundedRect(-containerWidth / 8, -containerWidth / 8, containerWidth / 4, containerWidth / 4, { tl: cr, tr: cr, bl: cr, br: cr })

            burbuja.rang = Phaser.Math.Between(0, 360);
            burbuja.rangrate = Phaser.Math.Between(10, 20);
            burbujas.push(burbuja)

        }

        // agrega las burbucas al contenedor principal
        const contenedor = scene.add.container();
        contenedor.add(cerveza);
        contenedor.add(burbujas);

        // metodos de la entidad
        contenedor.moverBurbujas = function () {
            for (key in burbujas) {
                const b = burbujas[key]
                b.setAngle(b.rang + ((Date.now() / b.rangrate) % 360))
            }
        }

        contenedor.subir = function (factor) {
            if (!factor) factor = 1;
            contenedor.y -= 0.1 * factor;
        }

        // retorna todo el contenedor, que es el que se va a mover
        return contenedor;
    }

    // crea el marco del juego
    function crearMarco(scene) {
        scene.cameras.main.setBackgroundColor('#F9D628');
        scene.add.image(0, 0, 'marco').setOrigin(0);
    }


}



// init
configureGame();
configureSockets();