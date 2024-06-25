export default class Start extends Phaser.Scene {
    constructor(){
        super("start");
    }
Init(data){

}

preload(){
    this.load.image("Inicio","./public/assets/GameOn.png");
    this.load.audio("ready","./public/audio/Start-music.mp3");
}


create(){
    this.add.image(400, 300, "Inicio");

    this.music = this.sound.add("ready");
     this.music.play();

    this.time.addEvent({ //Ocultar texto
        delay: 500,
        callback:this.onVisible,
        callbackScope:this,
        loop: true,
    });

    this.time.addEvent({ //Mostrar texto
        delay: 1000,
        callback:this.offVisible,
        callbackScope:this,
        loop: true,
    });

    this.helper= this.add.text(200,500, "Press <ENTER> to start", {
        fontSize: "20px",
    });

this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
}
update(){
    if(this.enter.isDown) {
        this.scene.start("main");
        this.music.stop();
    }
}

onVisible() {
    this.helper.setVisible(false);
}

offVisible() {
    this.helper.setVisible(true);
}
}