class Sword extends Phaser.Physics.Arcade.Sprite {

    //Constructeur de Wall

    constructor (scene, x, y, texture) {
        //On appelle le constructeur parent avec super
        super(scene, x, y, texture);
        //On ajoute le sprite et ça physique a la scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //On initialise ces paramètre de creation
        this.setScale(0.2);
        this.body.setAllowGravity(false);
        this.setDepth(1);
        this.setVisible(false);
        this.attack = 100
        this.disableBody()
        //this.sword = this.physics.add.sprite(0, 0, "sword").setScale(.1);
    }

}