// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {
    this.mDown = false; //maxspeed
    this.timer = 0; //Contador tiempo
    this.score= 0; //Contador de puntos
    this.healt= 3; 
    this.gameOver= false;
    this.tiempoInmunidad= 0;
  }

  preload() {
   this.load.image("fondo","./public/assets/fondoNegro.jpg"); //Fondo negro
   //Jaula
   this.load.image("platsuperior","./public/assets/plataformabases.png");
   this.load.image("platinferior","./public/assets/plataformabases.png");
   this.load.image("platizquierda","./public/assets/plataformalaterales.png");
   this.load.image("platderecha","./public/assets/plataformalaterales.png"); 
   this.load.spritesheet("personaje","./public/assets/Isaac.png", {frameWidth: 32, frameHeight: 32}); //Personaje
   this.load.spritesheet("aura","./public/assets/PJaura.png", {frameWidth:32, frameHeight: 32}); //aura de max.speed
   this.load.image("enemigo1","./public/assets/Enemigo1.png");
   this.load.image("enemigo2","./public/assets/Enemigo2.png");
   this.load.image("enemigo3","./public/assets/Enemigo3-1.png");
   this.load.image("destroy","./public/assets/object.png");
   this.load.image("particles","./public/assets/Particle.png");
   this.load.spritesheet("healt","./public/assets/Vidas.png", {frameWidth:32, frameHeight: 32}); //Vidas
   this.load.spritesheet("alerta","./public/assets/Alerta.png", {frameWidth:32, frameHeight: 32}); //Alerta
   this.load.spritesheet("enemigo4","./public/assets/enemigo4.png", {frameWidth:32, frameHeight: 32}); //Rayo gigante
   this.load.audio("hit","./public/audio/Hit.mp3");
   this.load.audio("advice","./public/audio/Alerta-loop.mp3");
   this.load.audio("explosion","./public/audio/Explosion.mp3");
   this.load.audio("musica","./public/audio/Game-music.mp3");
  }

  create() {

    this.musica= this.sound.add("musica");
    this.musica.play();

    this.anims.create({ //animaciones del personaje
      key:"quieto",
      frames: this.anims.generateFrameNumbers("personaje", {start:16,end:16}),
      frameRate:6,
      repeat:-1
    })

    this.anims.create({
      key:"arriba",
      frames: this.anims.generateFrameNumbers("personaje", {start:4,end:7}),
      frameRate:6,
      repeat:-1
    })

    this.anims.create({
      key:"abajo",
      frames: this.anims.generateFrameNumbers("personaje", {start:0,end:3}),
      frameRate:6,
      repeat:-1
    })

    this.anims.create({
      key:"derecha",
      frames: this.anims.generateFrameNumbers("personaje", {start:8,end:11}),
      frameRate:6,
      repeat:-1
    })

    this.anims.create({
      key:"izquierda",
      frames: this.anims.generateFrameNumbers("personaje", {start:12,end:15}),
      frameRate:6,
      repeat:-1
    })

    this.anims.create({
      //animacion aura
      key:"aura",
      frames: this.anims.generateFrameNumbers("aura", {start:0,end:3}),
      frameRate:6,
      repeat:-1
    })

    this.anims.create({
      //animacion alerta
      key:"alert",
      frames:this.anims.generateFrameNumbers("alerta", {start:0, end: 4}),
      frameRate: 6,
      repeat: 0
    })

    this.anims.create({
      //animacion rayo laser
      key:"laser",
      frames: this.anims.generateFrameNumbers("enemigo4", {start:0, end: 8}),
      frameRate: 16,
      repeat: 0
    })

   this.fondo = this.add.image(400,300, "fondo");

    this.spawn= this.time.addEvent({ //aparicion de proyectiles (dificultad 0)
      delay:2000,
      callback:this.onSecond,
      callbackScope: this,
      loop: true,
   });

   this.time.addEvent({ //evento contador de tiempo
      delay:1000,
      callback:this.handlerTimer,
      callbackScope: this,
      loop: true,
   })

   this.time.addEvent({ //evento contador de puntos
    //delay:1000,
    delay:100,
    callback:this.scoreTimer,
    callbackScope: this,
    loop: true,
 })

  this.las1= this.time.addEvent({ //evento aparicion de laser (dificultad 1)
    delay: 15000,
    callback:this.handlerLaser,
    callbackScope: this,
    loop: true,
  })

  this.time.addEvent({ //Cambio dificultad 1
    delay: 15000,
    callback:this.resetEvent,
    callbackScope:this,
    loop: false,
  })

  this.time.addEvent({ //Cambio dificultad 2
    delay: 60000,
    callback:this.maxReset,
    callbackScope:this,
    loop: false,
  })

  this.time.addEvent({ //Cambio dificultad 3
    delay: 120000,
    callback:this.ultraReset,
    callbackScope:this,
    loop: false,
  })
 
   this.timerText= this.add.text(560,10, `Time: ${this.timer}`, { //Texto de contador de tiempo
    fontSize: "28px",
    fill:"#ffffff",
   })

   this.scoreText= this.add.text(10,10, `Score: ${this.score}`, { //Texto de contador de tiempo
    fontSize: "28px",
    fill:"#ffffff",
   })

    this.enemigos = this.physics.add.group();

    this.laseres= this.physics.add.group();


    this.jaula = this.physics.add.staticGroup() //Fisica estática a la jaula
    this.jaula.create(400,150,"platsuperior").setScale(10).setSize(400,700).setOffset(176,-200);
    this.jaula.create(400,460,"platinferior").setScale(10).setSize(300,700).setOffset(-443,-510);
    this.jaula.create(235,305,"platizquierda").setScale(10).setSize(900,400).setOffset(-300,165)
    this.jaula.create(565,305,"platderecha").setScale(10).setSize(900,400).setOffset(-600,-535); //Creacion de jaula y Hitbox ajustada

    this.personaje = this.physics.add.sprite(400,300,"personaje").setScale(1.5);
    this.personaje.setSize(20,20);
    this.personaje.setCollideWorldBounds(true); //Activar colision
    this.group = this.add.group({
      key: "healt",
      frame: 0,
      repeat: 2
    });

    this.particles= this.add.particles(0,0,"particles", {
      speed: {min:30, max:40},
      lifespan: 2000,
      scale:{start:0.5, end:0 },
      quantity: 2,
      blendMode: 'ADD'
    }).setVisible(false);
    this.particles.startFollow(this.personaje);

    Phaser.Actions.GridAlign(this.group.getChildren(), { width: 10, cellWidth: 25, cellHeight: 48, x: 50, y: 60 }); //Children del grupo vidas


    const destroy= this.physics.add.image(400,300,"destroy").setScale(0.1).setImmovable(true).setVisible(false).setSize(20,20); //crear el objeto centro que destruye a los enemigos
    this.physics.add.collider(this.enemigos, destroy, this.destroyEnemy, null, this); //colision entre enemigos y el centro invisible

    this.physics.add.collider(this.personaje, this.jaula); //Agregar colision con la jaula

   this.physics.add.collider(
    this.personaje,
    this.enemigos,
    this.onImpact,
    null,
    this
   );

   this.physics.add.collider(
    this.personaje,
    this.laseres,
    this.onLaser,
    null,
    this
   );

    this.m = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M); //agregar tecla M para activar MaxSpeed

    this.inputKeys= this.input.keyboard.addKeys({ //controles
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })
  }

  onSecond() {
    const tipos = ["enemigo1","enemigo2","enemigo3"];
    const tipo = Phaser.Math.RND.pick(tipos); //elegir aleatoriamente el tipo de enemigo
    const x = Phaser.Math.Between(0,800);
    const y = Phaser.Math.Between(0,600);

    const pos = [[0,y], [800,y], [x,0], [x,600]]; //Posiciones

    const rndPos = Phaser.Math.RND.pick(pos); //Elegir aleatoriamente la posición

    const enemigo = this.enemigos.create(
      rndPos[0],
      rndPos[1],
      tipo
    ).setScale(1.5).setSize(11,11);
    this.physics.moveTo(enemigo, this.personaje.x, this.personaje.y, 150); //Hacer que el enemigo siga la posicion del personaje al iniciarse
    
  }

  handlerTimer(){ //contador de tiempo
    this.timer += 1;
    this.timerText.setText(`Time: ${this.timer}`);
  }

  scoreTimer(){ //contador de puntos
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  update() {
    if (this.inputKeys.left.isDown) {
      this.personaje.setVelocityX(-100);
      this.personaje.anims.play("izquierda", true);
    } else if (this.inputKeys.right.isDown){
      this.personaje.setVelocityX(100);
      this.personaje.anims.play("derecha", true);
    } else {
      this.personaje.setVelocityX(0);
    }

    if(this.inputKeys.up.isDown) {
      this.personaje.setVelocityY(-100);
      this.personaje.anims.play("arriba", true);
    } else if (this.inputKeys.down.isDown) {
      this.personaje.setVelocityY(100);
      this.personaje.anims.play("abajo", true);
    } else {
      this.personaje.setVelocityY(0);
    }
    
    if(this.m.isDown && this.inputKeys.left.isDown) {
      this.personaje.setVelocityX(-1000);
    } else if(this.m.isDown && this.inputKeys.right.isDown) {
      this.personaje.setVelocityX(1000);
    }

    if(this.m.isDown && this.inputKeys.up.isDown) {
      this.personaje.setVelocityY(-1000);
    } else if(this.m.isDown && this.inputKeys.down.isDown) {
      this.personaje.setVelocityY(1000);
    }

    if(this.m.isDown){
      this.particles.setVisible(true);
    } else{
      this.particles.setVisible(false);
    }

    if(this.healt <= 0) { //Pausar la escena al recibir 3 golpes
      this.gameOver = true;
    }

    if(this.gameOver) {
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
      this.musica.stop();
    }

    if(this.time.now >= this.tiempoInmunidad) {
      this.personaje.clearTint();
    }
    }

    destroyEnemy(destroy, enemy) {
      enemy.destroy(); //El enemigo se destruye al tocar el centro
    }

    onImpact(personaje, enemigo) { 
      enemigo.destroy();  //El enemigo se destruye al tocar al jugador
      this.healt -= 1;  //Se resta una vida cuando el jugador toca un enemigo
      this.hit= this.sound.add("hit");
      this.hit.play();

      this.personaje.setTint(0xff0000);
      this.tiempoInmunidad= this.time.now + 500

      const hp = this.group.getChildren(); //grupo de vidas
      
      const hearts = Phaser.Utils.Array.RemoveRandomElement(hp);

          if (hearts)
          {
              hearts.destroy();
          }

          console.log(this.group.getChildren());

    }

    handlerLaser() {
      const variantes= ["top", "bottom"];
      const alertPosition = Phaser.Math.RND.pick(variantes); // Elige entre top y bottom para elegir la posicion de la alerta

            // Determina las posiciones de la alerta y laser
            let alertaX, alertaY, otraImagenX, otraImagenY;
            if (alertPosition === 'top') {
                alertaX = 600;
                alertaY = 160;
                otraImagenX = 400;
                otraImagenY = 205;
            } else if (alertPosition === 'bottom') {
                alertaX = 600;
                alertaY = 440;
                otraImagenX = 400;
                otraImagenY = 355;
            }

            // Muestra la imagen de alerta
            const alerta = this.add.sprite(alertaX, alertaY, "alerta").setScale(1.5);
            alerta.play({
              key:"alert",
              hideOnComplete: true
            });

            this.aviso= this.sound.add("advice")
            this.aviso.play();

            // Después de 3 segundos, oculta la imagen de alerta y muestra el laser
            this.time.delayedCall(1500, function () {
              alerta.setVisible(false); // Oculta la imagen de alerta
              const laser = this.laseres.create(otraImagenX, otraImagenY, "enemigo4").setSize(35,25).setScale(10);
              laser.play({
                key: "laser",
                hideOnComplete: true
              }); // Muestra el laser

              this.explosion= this.sound.add("explosion")
              this.explosion.play();
      
              // Activar collider cuando la animación comienza
              laser.on('animationstart', () => {
                laser.body.enable = true;
              });
      
              // Desactivar collider cuando la animación termina
              laser.on('animationcomplete', () => {
                laser.body.enable = false;
                laser.destroy();
              });
            }, [], this);
    }

    onLaser(personaje, laser){
      this.healt -= 1;
      laser.body.enable = false;
      
      this.personaje.setTint(0xff0000);
      this.tiempoInmunidad= this.time.now + 500

      const hp = this.group.getChildren(); //grupo de vidas
      
      const hearts = Phaser.Utils.Array.RemoveRandomElement(hp);

          if (hearts)
          {
              hearts.destroy();
          }

          console.log(this.group.getChildren());
    }
    
    resetEvent() { //dificultad 1
      this.spawn.remove(false); //remover spawn de la dificultad anterior

      this.dif1= this.time.addEvent({ //aparicion de proyectiles (dificultad 1)
        delay:1000,
        callback:this.onSecond,
        callbackScope: this,
        loop: true,
     });
    }

    maxReset() { //dificultad 2
      this.dif1.remove(false); //remover el spawn de la dificultad anterior
      this.las1.remove(false); //remover laser de la dificultad anterior

      this.dif2= this.time.addEvent({ //Aparicion proyectiles (dificultad 2)
        delay: 500,
        callback:this.onSecond,
        callbackScope:this,
        loop: true,
      });

      this.las2= this.time.addEvent({ //evento aparicion de laser (dificultad 1)
        delay: 10000,
        callback:this.handlerLaser,
        callbackScope: this,
        loop: true,
      });
    }

    ultraReset() {
      this.dif2.remove(false); //remover el spawn de la dificultad anterior
      this.las2.remove(false); //remover laser de la dificultad anterior

      this.dif3= this.time.addEvent({ //Aparicion proyectiles (dificultad 3)
        delay: 300,
        callback:this.onSecond,
        callbackScope:this,
        loop: true,
      });

      this.las3= this.time.addEvent({ //evento aparicion de laser (dificultad 3)
        delay: 5000,
        callback:this.handlerLaser,
        callbackScope: this,
        loop: true,
      });
    }
    }
    
