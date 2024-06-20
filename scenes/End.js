export default class End extends Phaser.Scene {
    constructor(){
        super("end");
    }
init(data) { //Cargar data de puntaje y condicion de Game Over
    this.score = data.score;
    this.gameOver= data.gameOver;
}

preload() {
    this.load.image("gameover","./public/assets/Game-over.png");
}

create() {

    this.add.image(400,300, "gameover");

    const textEnd= this.add.text(250, 100, "Game Over", {fontSize:"60px"});
    const text= this.add.text(310, 200, `Score ${this.score}`, {fontSize:"40px"}); //Texto de puntaje
    const help= this.add.text(320, 280, "Press <R> to restart", {fontSize:"15px"});

    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (this.r.isDown) {
      this.scene.start("main");
}

}
}