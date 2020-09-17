var game;

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
        this.load.image('marco-simple', '../img/marco-simple.png');
        this.load.image('pajaro', '../img/pajaro.png');
        this.load.image('mesa', '../img/mesa.png');
        this.load.image('cerveza', '../img/cerveza.png');
        this.load.image('mensaje', '../img/mensaje.png');
        this.load.spritesheet("chancho", "../img/chancho-pet.png", {
            frameWidth: 351,
            frameHeight: 256,
            margin: 0,
            spacing: 0
        });

    }

    function create() {


        // crea las animaciones
        crearAnimaciones(this);

        // crea el contenedor de las cervezas
        this.cervezas = {};

        // crea las birritas
        this.cervezas.player1 = crearCerveza(this, 168, 500);
        // this.cervezas.player2 = crearCerveza(this, 770, 500);

        // crea el marco del juego
        crearMarco(this);

        // crea el socket del juego
        crearSocket(this);

        // crea el container de chanchos
        this.chanchos = this.add.group({
            active: true,
            runChildUpdate: true,
        })

        crearTitulo(this);

    }

    function update() {
        this.cervezas.player1.moverBurbujas();
        // this.cervezas.player2.moverBurbujas();
    }

    // Metodos del juego
    // --------------------------------

    function crearTitulo(scene) {
        scene.add.image(900, 250, "mensaje");
    }

    // crea el set de animaciones
    function crearAnimaciones(scene) {
        scene.anims.create({
            key: "chancho-jump",
            frameRate: 11,
            frames: scene.anims.generateFrameNumbers("chancho", { frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }),
            repeat: -1
        });
    }

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
            console.log(contenedor.y);
            if (contenedor.y >= -300)
                contenedor.y -= 0.3 * factor;
        }

        // retorna todo el contenedor, que es el que se va a mover
        return contenedor;
    }

    // crea el marco del juego
    function crearMarco(scene) {
        scene.cameras.main.setBackgroundColor('#F9D628');
        scene.add.image(0, 473, 'mesa').setOrigin(0).setDepth(-10);
        // scene.add.image(0, 0, 'marco').setOrigin(0);
        scene.add.image(0, 0, 'marco-simple').setOrigin(0);
    }

    // crea el socket del juego
    function crearSocket(scene) {
        scene.socket = io();
        scene.socket.on("tweet_player_1", (tweet) => {
            console.log(tweet.screenName);
            scene.cervezas.player1.subir(40);
            crearChancho(scene, tweet.screenName);
        });
        scene.socket.on("tweet_player_2", (tweet) => {
            console.log(tweet.screenName);
            scene.cervezas.player1.subir(40);
            crearChancho(scene, tweet.screenName);
        });
    }

    // crea el chancho del usuario
    function crearChancho(scene, nombre) {
        const velocidad = Phaser.Math.Between(1, 3);
        const contadorMax = 1;
        let x = 1280;
        let y = 620 + Phaser.Math.Between(-50, 50);
        const chancho = scene.add.sprite(x, y, "chancho").setScale(0.5);
        scene.chanchos.add(chancho);

        chancho.direccion = -1;
        chancho.contador = 0;
        chancho.nombre = crearNombre(scene, chancho.x, chancho.y - 60, nombre);

        if (Phaser.Math.Between(0, 1) == 0) {
            chancho.x = 0;
            chancho.setFlipX(true);
            chancho.direccion = 1;
        }

        chancho.anims.play("chancho-jump", true);

        chancho.update = function () {
            chancho.x += chancho.direccion * velocidad;
            chancho.nombre.mover(chancho.x);

            if (chancho.x < 0 || chancho.x > 1280) {
                chancho.setFlipX(!chancho.flipX);
                chancho.contador++;
                chancho.direccion = chancho.direccion * (-1);

                if (chancho.contador >= contadorMax) {
                    chancho.nombre.destroy();
                    chancho.destroy();
                }
            }
        }



        return chancho;
    }

    function crearNombre(scene, x, y, nombre) {

        var p = scene.add.image(x - 80, y, 'pajaro');
        var texto = scene.add.text(x - 50, y - 15, nombre, {
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fontSize: 30,
            color: 'black',
            backgroundColor: 'white',
            padding: 2
        });

        return {
            p: p,
            texto: texto,
            mover: function (x) {
                p.x = x - 80; texto.x = x - 50;
            },
            destroy: function () {
                p.destroy();
                texto.destroy();
            }
        };

    }


}


// init
configureGame();