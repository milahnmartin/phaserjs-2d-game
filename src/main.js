const phaserConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'phaser-game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    restartGame: restartGame,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
};

const phaserGame = new Phaser.Game(phaserConfig);

let platforms;
let player;
let dogs;
let treasure;
let bushes;
let cursors;
let startText;
let gameStarted = false; // Define gameStarted here

function preload() {
  this.load.image('background', 'assets/game_background.png');
  this.load.image('tree', 'assets/tree.png');
  this.load.image('bush', 'assets/bush.png');
  this.load.image('grass', 'assets/grass.png');
  this.load.image('treasure', 'assets/Chest.png');
  this.load.image('dog', 'assets/dog.png');
  this.load.image('player', 'assets/Hunter.png');
}

function create() {
  const { width, height } = this.scale;

  this.add.sprite(0, 0, 'background').setOrigin(0, 0).setDisplaySize(width, height);

  platforms = this.physics.add.staticGroup();
  bushes = this.physics.add.staticGroup();

  for (let i = 0; i < 5; i++) {
    platforms
      .create(i * width, height - 64, 'tree')
      .setScale(2)
      .refreshBody();
    bushes
      .create(i * width, height / 2, 'bush')
      .setScale(1)
      .refreshBody();
    platforms
      .create(i * width, 0, 'tree')
      .setScale(2)
      .refreshBody();
    bushes
      .create(i * width, height / 4, 'bush')
      .setScale(1)
      .refreshBody();
  }

  for (let i = 0; i < 5; i++) {
    platforms
      .create(i * width, height - 64, 'tree')
      .setScale(2)
      .refreshBody();
    bushes
      .create(i * width, height - height / 4, 'bush')
      .setScale(1)
      .refreshBody();
  }

  player = this.physics.add
    .sprite(100, height - 150, 'player')
    .setOrigin(0.5, 0.5)
    .setScale(0.2)
    .setInteractive();

  this.input.on('pointerdown', function (pointer) {
    if (!gameStarted) {
      startGame();
    }
    player.setVelocityX(300);
  });

  this.input.on('pointerup', function (pointer) {
    player.setVelocityX(0);
  });

  dogs = this.physics.add.group({
    key: 'dog',
    repeat: window.innerWidth / 250 ?? 4,
    setXY: { x: 100, y: 50, stepX: 200 },
    setScale: { x: 0.1, y: 0.1 },
  });

  treasure = this.physics.add.sprite(width - 50, height - 150, 'treasure').setScale(0.1); // Smaller chest

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(dogs, platforms);
  this.physics.add.collider(dogs, bushes);
  this.physics.add.overlap(player, dogs, hitDog, null, this);
  this.physics.add.overlap(player, treasure, collectTreasure, null, this);

  cursors = this.input.activePointer;

  // Display start text
  startText = this.add.text(width / 2, height / 2, 'CLICK the SCREEN TO BEGIN', {
    fontSize: '32px',
    fill: '#000',
    align: 'center',
  });
  startText.setOrigin(0.5);
  startText.setInteractive();
}

function update() {
  if (gameStarted && cursors.isDown) {
    player.rotation = Phaser.Math.Angle.BetweenPoints(player, cursors);
  }

  if (gameStarted) {
    dogs.children.iterate(function (dog) {
      dog.setVelocityY(Phaser.Math.Between(50, 100));
    });
  }
}

function hitDog(player, dog) {
  shakeCamera.call(this);
  this.cameras.main.fadeOut(500, 255, 255, 255);
  this.cameras.main.once(
    'camerafadeoutcomplete',
    function () {
      restartGame.call(this);
    },
    this
  );
}

function shakeCamera() {
  this.cameras.main.shake(500);
}

function collectTreasure(player, treasure) {
  alert('You found the treasure!');
  restartGame.call(this);
}

function restartGame() {
  gameStarted = false;
  startText.setText('CLICK the SCREEN TO BEGIN');
  this.scene.restart();
}

function startGame() {
  gameStarted = true;
  startText.setText('');
}
