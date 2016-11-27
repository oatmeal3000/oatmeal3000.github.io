//   _____       _ _   _       _ _         
//   \_   \_ __ (_) |_(_) __ _| (_)_______ 
//    / /\/ '_ \| | __| |/ _` | | |_  / _ \
// /\/ /_ | | | | | |_| | (_| | | |/ /  __/
// \____/ |_| |_|_|\__|_|\__,_|_|_/___\___|                           

/*
  Summary: Instantiate global game variables including the PHASER GAME object, preload assets, and call Phaser create() function
*/

  // - - - - - - - - - - - - - - - //
 // - - - - - VARIABLES - - - - - //
// - - - - - - - - - - - - - - - //
//CORE Phaser Game Object
var game = new Phaser.Game(640, 960, Phaser.CANVAS, '', { 
  preload: preload,   
  create: create,  
  update: update,  
  render: render //render.js
});

//core game variables
var debugging = false; //determines MODE
var gameState;
var youWin;
var deathType;

//levels + level data
var levels; //array of levels in game
var currentLevel; 
var currentSlide;
var lvlStr; //number of level you want to warp to
  
var levelElapsedSeconds; //number of ellapsed seconds of play in this level
var levelStartTime;
var levelStarted;

//player  data
var numberOfMoves;
var facing;

//Sprites
var heroSmart; //blue
var heroKiller; //red
var blocks;
var floorTiles;
var goal1; //blue
var goal2; //red
var enemies;
var switches;
var grayGates;

//Render
var uiBar;
var currentScreen; //index of the current screen or slide texture!!
var levelText;
var timeText;
var moveText;


  // - - - - - - - - - - - - - - - //
 // - - - - - - PRELOAD - - - - - //
// - - - - - - - - - - - - - - - //

/*
  Summary: preload all art + sound assets
*/
function preload() {

  //Set auto-scaling to match window size!
  game.stage.backgroundColor = '#000';
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.scale.setScreenSize();  

  loadImages(); //render.js
	loadSounds(); //audio.js
}


  // - - - - - - - - - - - - - - - //
 //- - - - - - CREATION - - - - - //
// - - - - - - - - - - - - - - - //

/*
  Summary: set up variables + create game objects (inc. sprites)
*/
function create() {
  //core game variables
  gameState = GAMESTATE_MENU; //replace with GAMESTATE_MENU
  youWin = null; //temp default setting
  deathType = null; //temp

  //set up levels array
  levels = [];
  initLevels(); //level.js

  //initiate level data
  currentLevel = -1;
  currentSlide = 0;
  levelElapsedSeconds = 0;
  levelStartTime = null; //between levels
  levelStarted = false;
  lvlStr = ""; 

  //player data
  numberOfMoves = 0;
  facing = "neutral";



  //set up important groups and sprites
  createSprites();

  //Set up HUD elements
  createHUD();

  //Draw the title screen
  currentScreen = game.add.image(0,0,'imageTitle');

  //Add Input Handlers
  document.addEventListener("keydown",keyDownHandler, false);
  document.addEventListener("keyup",keyUpHandler, false);
  game.input.onTap.add(tapHandler, this);
}

/*
  Summary: Instatiate all dynamic sprite objects
*/
function createSprites()
{
  floorTiles = game.add.group();
  blocks = game.add.group();
  enemies = game.add.group();

  //create the GOALS
  goal1 = game.add.sprite(0,0,'goalBrainy');
  goal2 = game.add.sprite(0,0,'goalBrawny');
  game.physics.enable(goal1, Phaser.Physics.ARCADE);
  game.physics.enable(goal2, Phaser.Physics.ARCADE);
  goal1.body.setSize(16,16,12,12);
  goal2.body.setSize(16,16,12,12);
  //goal1.body.setSize(30,30,5,5);
  //goal2.body.setSize(30,30,5,5);
  goal1.anchor.setTo(0.5);
  goal2.anchor.setTo(0.5);

  //Create the SWITCHES
  switches = [];
  switches[0] = game.add.sprite(0,0,'switch1On');
  switches[1] = game.add.sprite(0,0,'switch2On');
  switches[2] = game.add.sprite(0,0,'switch3On');
  switches[3] = game.add.sprite(0,0,'switch4On');
  for(var i=0;i<switches.length;i++)
  {
    game.physics.enable(switches[i], Phaser.Physics.ARCADE);
    switches[i].body.setSize(20,20,30,30);
  }

  //Create the matching GATES
  switches[0].gates = game.add.group();
  switches[1].gates = game.add.group();
  switches[2].gates = game.add.group();
  switches[3].gates = game.add.group();
  grayGates = game.add.group(); //colorless gates

  //create the Heroes
  heroSmart = game.add.sprite(20, 20, 'brainy');
  heroSmart.name = "Brainy";
  heroSmart.moving = false;
  game.physics.enable(heroSmart, Phaser.Physics.ARCADE);
  // heroSmart.body.bounce.setTo(0);
  // heroSmart.body.deltaMax = 1;

  heroKiller = game.add.sprite(20, 100, 'brawny');
  heroKiller.name = "Brawny";
  heroKiller.moving = false;
  game.physics.enable(heroKiller, Phaser.Physics.ARCADE);
  // heroKiller.body.bounce.setTo(0);
  // heroKiller.body.deltaMax = 1;

  //rotation experiment
  // heroSmart.anchor.setTo(0.5,0.5);
  // heroKiller.anchor.setTo(0.5,0.5);

}

function createHUD()
{
  //Create HUD
  uiBar = {w: game.width, h: 64};
  uiBar.sprite = game.add.sprite(0,0,'imageHUD');

  //Create HUD Text
  levelText = game.add.text(TEXT_LEVEL_X,UI_TEXT_HEIGHT,"1", STYLE_HUD);
  timeText = game.add.text(TEXT_TIME_X,UI_TEXT_HEIGHT,"0:00",STYLE_HUD);  
  moveText = game.add.text(TEXT_MOVES_X ,UI_TEXT_HEIGHT,"00", STYLE_HUD);

  //add Restart BUTTON
  restartButton = game.add.button(555,-7, 'rButton', restartButtonHandler, this, 0,0,0);
  restartButton.scale.setTo(1.3,1.3);
}









