class Enemy extends Phaser.Physics.Arcade.Sprite {

    //Constructeur de Wall

    constructor (scene, x, y, texture) {
        //On appelle le constructeur parent avec super
        super(scene, x, y, texture);
        //On ajoute le sprite et ça physique a la scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //On initialise ces paramètre de creation
        this.setDisplaySize(100, 150)
        this.setCollideWorldBounds(false);
        this.setDepth(0);
        this.body.setImmovable(true)
        this.hp = 100;
    }

}