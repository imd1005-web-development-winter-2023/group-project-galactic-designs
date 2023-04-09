let config = {
  type: Phaser.AUTO,
  width: 11900,
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

let player;
let platforms;
let cursors;
//velocity[0] is velocity x and velocity[1] is velocity y
let velocity = [0,0];
let velocityCap=600;
let rotationL=false;  
let cameraSmooth=0;
const cameraCap=150;
let hitRot=false;
let attackInAir=false;
let loopTimes=0;
const backgroundplacement=600;


let game = new Phaser.Game(config);

function preload ()
{
  //keyboard input letiables
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

  //load images
  this.load.image('ground', 'images/platform.png');
  this.load.image('sky', 'images/background.png');
  this.load.image('bana', 'images/Banana.png');
  this.load.image('melon', 'images/Watermelon.png');
  this.load.image('clouds', 'Background_Layers/clouds_front.png');
  this.load.image('cloudsback', 'Background_Layers/clouds_behind.png');
  this.load.image('ground', 'Background_Layers/ground.png');
  this.load.image('trees1', 'Background_Layers/trees_front.png');
  this.load.image('trees2', 'Background_Layers/trees_second_layer.png');
  this.load.image('trees3', 'Background_Layers/trees_third_layer.png');
  this.load.image('mountain', 'Background_Layers/mountains.png');

  //weapon hitbox test
  this.load.image('weapon', 'images/weapon-hitbox test.png');
  
  //load spritesheet
  this.load.spritesheet('lemon', 
  'images/Princess_Lemon-Sheet.png',
  { frameWidth: 104, frameHeight: 96 });

  this.load.spritesheet('rotton',
  'images/Rotton_Knight-Sheet.png',
  { frameWidth: 92, frameHeight: 80 });

  this.load.spritesheet('tomato',
   'images/Tomato.png',
   {frameWidth: 60, frameHeight: 60});
}

function create ()
{

  //make sky
  // this.add.image(950, 540, 'sky').setScale(17);

  // background=this.physics.add.group();
  
  this.add.rectangle(950,540,1900,1080,0x87CEEB,1).setScrollFactor(0);
  this.add.image(1500, backgroundplacement, 'mountain').setScrollFactor(.1);
  this.add.image(1500, backgroundplacement, 'clouds').setScrollFactor(.15);

  this.add.image(1200, backgroundplacement, 'melon').setScale(.8).setScrollFactor(.5);
  this.add.image(3000, backgroundplacement, 'melon').setScrollFactor(.5);
  this.add.image(51, backgroundplacement, 'melon').setScrollFactor(.5);
  this.add.image(1003, backgroundplacement, 'bana').setScrollFactor(.5);
  this.add.image(2300, backgroundplacement, 'bana').setScrollFactor(.5);
  this.add.image(3500, backgroundplacement, 'bana').setScrollFactor(.5);


  this.add.image(1500, backgroundplacement, 'trees1').setScrollFactor(.9);


  // background.children.allowGravity = false;

  platforms = this.physics.add.staticGroup();

  platforms.create(950, 1000, 'ground').setScale(10).refreshBody();

  //player create
  player = this.physics.add.sprite(100, 350, 'lemon');
  player.setSize(50,96);

  // https://www.youtube.com/watch?v=SCO2BbbO17c made using this helpful video. it is using a typescript file but i tuned it for javascript
  
  
  weapon = this.add.rectangle(0,0,45,64,0xffffff,0);//0.5 for the last var to see the box
  weapon = this.physics.add.existing(weapon,0);//no gravity copied from this https://stackoverflow.com/questions/72443441/phaser-3-arcade-gravity-isnt-working-properly-no-matter-what-value-i-set-it-to
  weapon.body.allowGravity = false;
  this.physics.world.remove(weapon.body);


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
    frameRate: 5
  });
  this.anims.create({
    key: 'jump1L',
    frames: this.anims.generateFrameNumbers('lemon', { start: 14, end: 16 }),
    frameRate: 5
  });
  this.anims.create({
    key: 'swingRight',
    frames: this.anims.generateFrameNumbers('lemon', { start: 17, end: 18 }),
    frameRate: 5
  });
  this.anims.create({
    key: 'swingLeft',
    frames: this.anims.generateFrameNumbers('lemon', { start: 19, end: 20 }),
    frameRate: 5
  });

  rotton = this.physics.add.sprite(300,800,'rotton');


  //rotton
  this.anims.create({
    key: 'rotTurnL',
    frames: [ { key: 'rotton', frame: 5 } ],
    frameRate: 1
  });
  this.anims.create({
    key: 'rotTurnR',
    frames: [ { key: 'rotton', frame: 9 } ],
    frameRate: 1
  });
  this.anims.create({
    key: 'rotWalkR',
    frames: this.anims.generateFrameNumbers('rotton', { start: 0, end: 3 }),
    frameRate: 5
  });
  this.anims.create({
    key: 'rotWalkL',
    frames: this.anims.generateFrameNumbers('rotton', { start: 5, end: 8 }),
    frameRate: 5
  });
  this.anims.create({
    key: 'rotFall',
    frames: this.anims.generateFrameNumbers('rotton', { start: 10, end: 11 }),
    frameRate: 10
  });

  tomato = this.physics.add.sprite(500,800,'tomato');

  this.anims.create({
    key: 'tomaWalkR',
    frames: this.anims.generateFrameNumbers('tomato', { start: 0, end: 1 }),
    frameRate: 5
  });
  this.anims.create({
    key: 'tomaWalkL',
    frames: this.anims.generateFrameNumbers('tomato', { start: 2, end: 3 }),
    frameRate: 5
  });

  tomato.anims.play('tomaWalkR',true);
  tomato.setVelocityX(100);


  //create camera
  mainCamera=this.cameras.main.setSize(1900, 1080);

  mainCamera.setBounds(0,0,11900,1080,false)


  //add collision
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(rotton, platforms);
  this.physics.add.collider(tomato, platforms);
  this.physics.add.overlap(player, tomato, touchEnemy, null, this);
  this.physics.add.overlap(weapon, rotton, touchRotton, null, this);
  this.physics.add.overlap(weapon, tomato, hitEnemy, null, this);

  //for movement of character
  cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  if(loopTimes>=1)
  {
    loopTimes++;
  }

  if (hitRot===false)
  {
    //rotton knight
    rotton.anims.play('rotWalkR',true);
    rotton.setVelocityX(100);
  }

  //player physics
  if (player.body.touching.down)
  {
    velocityCap=600;
    velocity[1]=0;
    attackInAir=false;
  }


   if (attackInAir===false&&keyA.isDown)
  {
    velocity[1]-=100;
    player.setVelocityY(-500);
    if(rotationL===true && cursors.right.isDown===false || cursors.left.isDown)
    {
      weapon.x = player.x-50;
      weapon.y = player.y;
    }  
    else if(rotationL===false || cursors.right.isDown===true)
    {
      weapon.x = player.x+50;
      weapon.y = player.y;
    }
    this.physics.world.add(weapon.body);//again following the video for creatin a hitbox but weapon.body cannot have a this. in front of it for some reason
    weapon.body.enable=true;
    attackInAir=true;
    loopTimes=1;
  }
  else if (cursors.left.isDown && cursors.right.isDown && player.body.touching.down)
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
  else if (keyD.isDown&&player.body.touching.down&&cursors.right.isDown&&cursors.left.isDown)
  {
    velocity[1]-=600;
    player.setVelocityY(velocity[1]);
    velocityCap=900;
  }
  else if (keyD.isDown&&player.body.touching.down&&cursors.right.isDown)
  {
    velocity[1]-=600;
    player.setVelocityY(velocity[1]);
    velocityCap=900;

    velocity[0]=900;
    player.setVelocityX(velocity[0]);
  }
  else if (keyD.isDown&&player.body.touching.down&&cursors.left.isDown)
  {
    velocity[1]-=600;
    player.setVelocityY(velocity[1]);
    velocityCap=900;

    velocity[0]=-900;
    player.setVelocityX(velocity[0]);
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
  if (loopTimes>0)
  {
    if(rotationL===true && cursors.right.isDown===false || cursors.left.isDown)
    {
      player.anims.play('swingLeft',true);
    }  
    else if(rotationL===false || cursors.right.isDown===true)
    {
      player.anims.play('swingRight',true);
    }
  }
  else if(player.body.touching.down===true && velocity[0]<-3)
  {
    player.anims.play('left',true);
  }
  else if(player.body.touching.down===true && velocity[0]>3)
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
  //end of player

  //camera
  if (rotationL)
  {
    cameraSmooth-=10;
    mainCamera.scrollX = (player.x-950+cameraSmooth)|0;
  }
  else if (rotationL===false)
  {
    cameraSmooth+=10;
    mainCamera.scrollX = (player.x-950+cameraSmooth)|0;
  }

  if(mainCamera.x<0)
  {
    mainCamera.scrollX = (0)|0;
  }

  if(cameraSmooth>cameraCap)
  {
    cameraSmooth=cameraCap;
  }
  else if(cameraSmooth<-cameraCap)
  {
    cameraSmooth=-cameraCap;
  }

  //disable weapon hitbox
  if (loopTimes==5)
  {
    weapon.body.enable=false;
    this.physics.world.remove(weapon.body);
    loopTimes=0;
  }
}

function touchRotton(player, rotton)
{
  rotton.anims.play('rotFall',true);
  rotton.setVelocityX(0);
  rotton.setVelocityY(-700);
  hitRot=true;
}

function hitEnemy(player, tomato)// it turns out the player in (player, tomato) is required even though it is not used
{
  tomato.setActive(false).setVisible(false);
}

function touchEnemy(player,tomato)
{
  player.setActive(false).destroy();
}