class scene extends Phaser.Scene {
  function

  preload() {
    /**
     * on load nos images objets + la tilemap et le fichier json
     */
    this.load.image('background', 'assets/images/background.png');
    this.load.image('door', 'assets/images/Door.png');
    this.load.image('key', 'assets/images/Key.png');
    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('move', 'assets/images/mouvable.png');
    this.load.image('save', 'assets/images/Save.png');
    this.load.image('enemy', 'assets/images/enemy.png');
    this.load.image('sword', 'assets/images/sword.png');
    this.load.image('lianne', 'assets/images/lianne.png');
    this.load.image('luciole1', 'assets/images/luciole.png');
    // At last image must be loaded with its JSON
    this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
    this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
  }


  create() {
    /**
     * on initialise les valeurs de la sauvegarde
     * @type {number}
     */
    this.currentSaveX = 0;
    this.currentSaveY = 0;
    this.currentKey= 0;
    /**
     * creation de la map et du  layer plateforme
     * @type {Phaser.GameObjects.Image}
     */

    const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
    backgroundImage.setScale(2);
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');
    this.platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
    this.platforms.setCollisionByProperty({collides:true})



    /**
     * on créer les multiple groupe des layers objets
     * @type {Phaser.Physics.Arcade.Group}
     */
    /** groupe porte */
    this.doors=this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    map.getObjectLayer('Door').objects.forEach((doors)=>{
      const DoorSprite = this.doors.create(doors.x, doors.y +9+ doors.height, 'door').setOrigin(0).key=1;
    });

/** groupe des clefs */
    this.key=this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    map.getObjectLayer('key').objects.forEach((key)=>{
      const keySprite = this.key.create(key.x, key.y +200- key.height, 'key').setOrigin(0).key=1;
    });



/** groupe des objets déplaçable*/
    this.moves = this.physics.add.group({
      allowGravity: true,
      immovable: false
    });
    map.getObjectLayer('Mouvable').objects.forEach((move) => {
      this.moveSprite = this.moves.create(move.x, move.y + 100 - move.height, 'move').setOrigin(0);
    });



    this.physics.add.collider(this.moves, this.moveSprite)
    this.physics.add.collider(this.moves, this.platforms)

    this.player = new Player(this);

    this.enemy = new Enemy(this, 1200, 900, 'enemy');
    this.physics.add.collider(this.enemy, this.platforms);
    this.physics.add.collider(this.enemy, this.player.player);

    this.sword = new Sword(this, 0, 0, 'sword');
    this.physics.add.collider(this.sword, this.enemy);
    this.swordGameplay();

    this.lianne = new Lianne(this, 2365, 1050, 'lianne');
    this.physics.add.overlap(this.player.player, this.lianne,this.touch.bind(this),null,this);

    this.rightDown=true;
    this.leftDown=true;
    this.downDown=true;

/** gorupe des trou*/
this.trous = this.physics.add.group({
    allowGravity: false,
    immovable: true
});
// ceci permet au images que vous avez placé sur Tiled d'avoir une boite de colision mais aussi d'etre invisible
      map.getObjectLayer('Trous').objects.forEach((spike) => {
          //si vous utilisez une autre image que les piques remplacez le 'spike' avec le nom de l'image que vous avez remplacé (le nom déclaré dans preload)
          const trousSprite = this.trous.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0).visible = false ;
      });
    this.physics.add.collider(this.player.player, this.trous, this.playerHit, null, this);

    /** groupe des saves*/
    this.saves = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    map.getObjectLayer('Save').objects.forEach((save) => {
      const saveSprite = this.saves.create(save.x, save.y + 200 - save.height, 'save').setOrigin(0);
    });
    this.physics.add.overlap(this.player.player, this.saves, this.sauvegarde, null, this)

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player.player);

      this.configFX1 = {
          rotate: {min:0,max:360},
          scale: {start: 0.2, end: 0.1},
          alpha: { start: 1, end: 0 },
          blendMode: Phaser.BlendModes.ADD,
          speed:12
      };
      this.fx = this.add.particles('luciole1')//On charge les particules à appliquer au layer
      this.fx.createEmitter(this.configFX1)
      this.fx.setPosition(600, 1100);
  }

  /**
   * fonction exécuter des lors que le joueur touche un objet "save" qui enregistre les variables du player au moment T + désactive la collision de l'objet pour ne pas réexécuter a chaque collision
   * @param player
   * @param saves
   */
  sauvegarde(player, saves) {
    console.log("current", this.currentSaveX, this.currentSaveY)
    this.currentSaveX = player.x
    this.currentSaveY = player.y
    saves.body.enable = false;
    this.currentKey = player.key
  }

  playerHit(player, spike) {
    player.setVelocity(0, 0);
    player.x = this.currentSaveX
    player.y = this.currentSaveY;
    player.key= this.currentKey
    player.play('idle', true);
    player.setAlpha(0);
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });
  }

  swordGameplay(){
      this.input.on('pointerdown', function (pointer) {
          //On rend l'épée visible
          this.sword.setVisible(true);
          //On active le body de l'épée
          this.sword.enableBody()
          //On ajoute un event avec un delay qui fera disparaitre l'épée pendant 250 ms
          this.time.addEvent({ delay: 250, callback: this.onEvent, callbackScope: this });

      }, this);

      let me = this;
      //On enleve des points de vie a l'enemie qu'on touche
      this.physics.add.overlap(this.sword, this.enemy, function (){
          me.enemy.hp -= me.sword.attack;
      })
  }

  //Event qui permet de faire disparaitre l'épée
    onEvent()
    {
        this.sword.disableBody()
        this.sword.setVisible(false);
    }

    touch(player, lianne){
        if (this.cursors.space.isDown || this.cursors.up.isDown){
            this.player.player.setVelocityY(-100);
            this.player.player.body.setAllowGravity(true);
        }
    }


  update() {
      if (this.player.pousse ){
          this.player.pousse=false
      }
      else {
          this.moves.setVelocityX(0)
      }

      this.sword.x = this.player.player.x+50;
      this.sword.y = this.player.player.y;

      //console.log(this.player.player.body.x)
      //console.log(this.player.player.body.y)

      if(this.enemy.hp <= 0){
          this.enemy.disableBody()
          this.enemy.setVisible(false)
      }

      if(this.player.player.onlianne){
          this.player.player.onlianne=false
          if (this.upDown){
              this.player.player.setVelocityY(-100);
              this.player.player.body.setAllowGravity(true);
          }
          else if (this.downDown){
              this.player.player.setVelocityY(100);
              this.player.player.body.setAllowGravity(true);
          }
          else{
              this.player.player.setVelocityY(0);
              this.player.player.body.setAllowGravity(false);

          }
      }
      if (!this.player.player.onlianne){
          if (this.downDown || this.upDown || this.rightDown || this.leftDown){
              this.player.player.body.setAllowGravity(true);
          }
      }




    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.player.body.onFloor()) {
      this.player.jump();
      this.upDown=true;
      console.log("oui")
    }else if(this.cursors.up.isUp){
        this.upDown=false;
    }
    if (this.cursors.left.isDown) {
        this.leftDown = true;
        this.player.moveLeft()
    } else if (this.cursors.right.isDown) {
        this.rightDown = true;
        this.player.moveRight()
    }else if(this.cursors.down.isDown) {
        this.downDown = true;
    }else {
        this.player.stop();
    }

    console.log(this.player.player.onlianne)
  }
}