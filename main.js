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
var rotationL=false;


var game = new Phaser.Game(config);

function preload ()
{
  //keyboard input variables
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  //load images
  this.load.image('ground', 'images/platform.png');
  this.load.image('sky', 'images/backround.jpg');
  
  //load spritesheet
  this.load.spritesheet('lemon', 
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
  player = this.physics.add.sprite(100, 350, 'lemon');

  
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('lemon', { start: 9, end: 12 }),
    frameRate: 10,
  });

  this.anims.create({
    key: 'turnR',
    frames: [ { key: 'lemon', frame: 0 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'turnL',
    frames: [ { key: 'lemon', frame: 8 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('lemon', { start: 4, end: 7 }),
    frameRate: 10
  });
  this.anims.create({
    key: 'jump1R',
    frames: this.anims.generateFrameNumbers('lemon', { start: 1, end: 3 }),
    frameRate: 10
  });

  this.anims.create({
    key: 'jump2R',
    frames: [ { key: 'lemon', frame: 2 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'jump3R',
    frames: [ { key: 'lemon', frame: 3 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'jump1L',
    frames: this.anims.generateFrameNumbers('lemon', { start: 14, end: 16 }),
    frameRate: 10
  });

  this.anims.create({
    key: 'jump2L',
    frames: [ { key: 'lemon', frame: 6 } ],
    frameRate: 1
  });

  this.anims.create({
    key: 'jump3L',
    frames: [ { key: 'lemon', frame: 7 } ],
    frameRate: 1
  });


  //for actual animations
  // this.anims.create({
  //   key: 'right',
  //   frames: this.anims.generateFrameNumbers('lemon', { start: 5, end: 8 }),
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
    velocity[1]=0;
  }

  if (cursors.left.isDown && cursors.right.isDown && player.body.touching.down)
  {
    velocity[0]*=.7;
    player.setVelocityX(velocity[0]);
  }
  else if (cursors.left.isDown && player.body.touching.down)
  {
    velocity[0]-=100;
    player.setVelocityX(velocity[0]);
  }
  else if (cursors.right.isDown && player.body.touching.down)
  {
    velocity[0]+=100;
    player.setVelocityX(velocity[0]);
  } 
  else if (cursors.left.isDown && cursors.right.isDown && player.body.touching.down===false)
  {
    velocity[0]*=.95;
    player.setVelocityX(velocity[0]);
  }
  else if (cursors.left.isDown && player.body.touching.down===false)
  {
    velocity[0]-=50;
    player.setVelocityX(velocity[0]);
  }
  else if (cursors.right.isDown && player.body.touching.down===false)
  {
    velocity[0]+=50;
    player.setVelocityX(velocity[0]);
  } 
  else if (!player.body.touching.down)
  {
    velocity[0]*=.95;
    player.setVelocityX(velocity[0]);
  } 
  else
  {
    velocity[0]*=.7;
    player.setVelocityX(velocity[0]);

    //scrapped
    // if (rotationL==true)
    // {
    //   player.anims.play('turnL');
    // }
    // else
    // {
    //   player.anims.play('turnR');
    // }
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
    velocity[1]-=800;
    player.setVelocityY(velocity[1]);
  }
  else if (keyD.isDown&&player.body.touching.down)
  {
    //todo add animation
    velocity[1]-=600;
    player.setVelocityY(velocity[1]);
    velocityCap=900;
    if (rotationL===true){
      velocity[0]=- 900;
    } 
    else if (rotationL===false)
    {
      velocity[0]=900;
    }
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


  //setting rotation
  if (velocity[0]<-0.1)
  {
    rotationL=true;
  }
  else if(velocity[0]>0.1)
  {
    rotationL=false;
  }


  //animations
  if(player.body.touching.down===true && velocity[0]<-0.1)
  {
    player.anims.play('left',true);
  }
  else if(player.body.touching.down===true && velocity[0]>0.1)
  {
    player.anims.play('right',true);
  }
  else if(player.body.touching.down===true && rotationL===true)
  {
    player.anims.play('turnL');
  }
  else if(player.body.touching.down===true && rotationL===false)
  {
    player.anims.play('turnR');
  }
  else if(player.body.touching.down===false && rotationL===true)
  {
    player.anims.play('jump1L',true);
  }
  else if(player.body.touching.down===false && rotationL===false)
  {
    player.anims.play('jump1R',true);
  }
}
