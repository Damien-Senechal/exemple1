class Lianne extends Phaser.Physics.Arcade.Sprite {

    //Constructeur de Wall

    constructor (scene, x, y, texture) {
        //On appelle le constructeur parent avec super
        super(scene, x, y, texture);
        //On ajoute le sprite et ça physique a la scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //On initialise ces paramètre de creation
        //this.lianne = this.physics.add.sprite(396, 365, 'ground');
        this.setTintFill();
        this.setDisplaySize(10,1000);
        this.body.setAllowGravity(false);
        this.setImmovable(true);
        this.setOrigin(0,1)
        this.setTintFill(0x00FF00)
    }

}