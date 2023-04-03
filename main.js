//
//  JS File
//  You may remove the code below - it's just boilerplate
//
var config = {
  type: Phaser.AUTO,
  width: 1900,
  height: 1080,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 2000 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var player;
var platforms;
var cursors;
//velocity[0] is velocity x and velocity[1] is velocity y
var velocity = [0,0];
var velocityCap=600;


var game = new Phaser.Game(config);

function preload ()
{
  //keyboard input variables
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  //load images
  this.load.image('ground', 'images/platform.png');
  this.load.image('sky', 'images/backround.jpg');
  
  //load spritesheet
  this.load.spritesheet('dude', 
  'images/Princess_Lemon-Sheet.png',
  { frameWidth: 60, frameHeight: 96 });
}

function create ()
{
  //make sky
  this.add.image(950, 540, 'sky');

  platforms = this.physics.add.staticGroup();

  platforms.create(950, 700, 'ground').setScale(10).refreshBody();

  //player create
  player = this.physics.add.sprite(100, 350, 'dude');

  
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: [ { key: 'dude', frame: 1 } ],
    frameRate: 10,
  });

  this.anims.create({
    key: 'turnR',
    frames: [ { key: 'dude', frame: 0 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'turnL',
    frames: [ { key: 'dude', frame: 0 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10
  });
  this.anims.create({
    key: 'jump1',
    frames: [ { key: 'dude', frame: 1 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'jump2',
    frames: [ { key: 'dude', frame: 2 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'jump3',
    frames: [ { key: 'dude', frame: 3 } ],
    frameRate: 1
  });


  //for actual animations
  // this.anims.create({
  //   key: 'right',
  //   frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
  //   frameRate: 10,
  //   repeat: -1
  // });

  this.physics.add.collider(player, platforms);

  //for movement of character
  cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  //player physics

  if (player.body.touching.down)
  {
    velocityCap=600;
  }
  
  if (cursors.left.isDown)
  {
    velocity[0]-=100;
    player.setVelocityX(velocity[0]);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
    velocity[0]+=100;
    player.setVelocityX(velocity[0]);

    player.anims.play('right', true);
  } 
  else if (!player.body.touching.down)
  {
    velocity[0]*=.95;

    player.setVelocityX(velocity[0]);

    player.anims.play('turn');
  }
  else
  {
    velocity[0]*=.7;
    player.setVelocityX(velocity[0]);

    player.anims.play('turn');
  }
  if (cursors.up.isDown && player.body.touching.down)
  {
    player.setVelocityY(-800);
    player.anims.play('jump')
  }
  if (keyD.isDown&&player.body.touching.down)
  {
    //todo add animation

    player.setVelocityY(-600);

    velocityCap=900;
  }

  //velocity capps
  if (velocity[0]>velocityCap) 
  {
    velocity[0]=velocityCap;
  }
  if (velocity[0]<-velocityCap)
  {
    velocity[0]=-velocityCap;
  }
}
