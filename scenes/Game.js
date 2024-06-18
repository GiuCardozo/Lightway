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
  }

  preload() {
   this.load.image("fondo","../public/assets/fondoNegro.jpg"); //Fondo negro
   //Jaula
   this.load.image("platsuperior","../public/assets/plataformabases.png");
   this.load.image("platinferior","../public/assets/plataformabases.png");
   this.load.image("platizquierda","../public/assets/plataformalaterales.png");
   this.load.image("platderecha","../public/assets/plataformalaterales.png"); 
   this.load.spritesheet("personaje","../public/assets/Isaac.png", {frameWidth: 32, frameHeight: 32}); //Personaje
   this.load.spritesheet("aura","../public/assets/PJaura.png", {frameWidth:32, frameHeight: 32}); //aura de max.speed
   this.load.image("enemigo1","./public/assets/Enemigo1.png");
   this.load.image("enemigo2","./public/assets/enemigo2_0001.png");
   this.load.image("enemigo3","./public/assets/enemigo3.png");
  }

  create() {
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

   this.fondo = this.add.image(400,300, "fondo");

   this.time.addEvent({ //aparicion de proyectiles
      delay:3000,
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
 
   this.timerText= this.add.text(560,10, `Tiempo: ${this.timer}`, { //Texto de contador de tiempo
    fontSize: "28px",
    fill:"#ffffff",
   })

   this.scoreText= this.add.text(10,10, `Puntos: ${this.score}`, { //Texto de contador de tiempo
    fontSize: "28px",
    fill:"#ffffff",
   })

    this.enemigos = this.physics.add.group();


    this.jaula = this.physics.add.staticGroup() //Fisica estática a la jaula
    this.jaula.create(400,150,"platsuperior").setScale(10).setSize(400,700).setOffset(176,-200);
    this.jaula.create(400,460,"platinferior").setScale(10).setSize(300,700).setOffset(-443,-510);
    this.jaula.create(235,305,"platizquierda").setScale(10).setSize(900,400).setOffset(-300,165)
    this.jaula.create(565,305,"platderecha").setScale(10).setSize(900,400).setOffset(-600,-535); //Creacion de jaula y Hitbox ajustada

    this.personaje = this.physics.add.sprite(400,300,"personaje").setScale(2);
    this.personaje.setSize(20,20);
    this.personaje.setCollideWorldBounds(true); //Activar colision

    this.physics.add.collider(this.personaje, this.jaula); //Agregar colision con la jaula

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

    const pos = [[0,y], [800,y], [x,0], [x,600]];

    const rndPos = Phaser.Math.RND.pick(pos);

    const enemigo = this.enemigos.create(
      rndPos[0],
      rndPos[1]

    )
    /*let enemigo = this.enemigos.create(
      Phaser.Math.Between(0, 800), //Poner posiciones de aparicion
      Phaser.Math.Between(0, 600),
      0,
      tipo 
    );*/
  }

  handlerTimer(){
    this.timer += 1;
    this.timerText.setText(`Tiempo: ${this.timer}`);
  }

  scoreTimer(){
    this.score += 1;
    this.scoreText.setText(`Puntos: ${this.score}`);
  }

  update() {
    let speed= 100;
    let personajeVelocidad= new Phaser.Math.Vector2();
   if(this.inputKeys.left.isDown) {
      personajeVelocidad.x= -1;
      this.personaje.anims.play("izquierda", true);
    
  }else if(this.inputKeys.right.isDown) {
      personajeVelocidad.x= 1;
      this.personaje.anims.play("derecha", true);
  }
  if(this.inputKeys.up.isDown) {
    personajeVelocidad.y= -1;
    this.personaje.anims.play("arriba", true);
  }else if(this.inputKeys.down.isDown) {
    personajeVelocidad.y= 1;
    this.personaje.anims.play("abajo", true);
  }
  personajeVelocidad.scale(speed);
  this.personaje.setVelocity(personajeVelocidad.x,personajeVelocidad.y);



    if(this.m.isDown){
      speed=100;
      personajeVelocidad.scale(speed);
      this.personaje.setVelocity(personajeVelocidad.x,personajeVelocidad.y); //multiplicador de velocidad
      this.personaje.anims.play("aura", true);
       // accion que se ejecuta al mantener presionada la tecla
    } else {
      this.maxSpeed= false; //acción que se ejecuta al soltar la tecla
    }
    }

    }
  //}


//}
