var canvas;
var backgroundImage;
var bgImg;
var database;
var gameState;
var form, player;
var playerCount;
var car1Image;
var car2Image;
var car1;
var car2;
var cars=[];
var trackImage;
var allPlayers;
var fuel;
var fuelImage;
var coin;
var coinImage;
var spriteGroup;
var fuels;
var coins;
var obstacles;
var obstacle1Image;
var obstacle2Image;
var life;
var lifeImage;
var blast;
var blastImage;


function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Image = loadImage("./assets/car1.png")
  car2Image = loadImage("./assets/car2.png")
  trackImage = loadImage("./assets/track.jpg")
  coinImage = loadImage("./assets/goldCoin.png")
  fuelImage = loadImage("./assets/fuel.png")
  obstacle1Image = loadImage("./assets/obstacle1.png")
  obstacle2Image = loadImage("./assets/obstacle2.png")
  lifeImage = loadImage("./assets/life.png")
  blastImage = loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  console.log("the gamestate is:",gameState)
  
}

function draw() {
  background(backgroundImage);
  if(playerCount==2){
    game.update(1)
  }
  
  if(gameState==1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


