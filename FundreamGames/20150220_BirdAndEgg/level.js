//    __                _ 
//   / /  _____   _____| |
//  / /  / _ \ \ / / _ \ |
// / /__|  __/\ V /  __/ |
// \____/\___| \_/ \___|_|
//

/*
  Handles loading and manipulation of LEVELS 
  (Note: no current "level" object outside of the simple map objects defined in constants.js)
*/
                       
  // - - - - - - - - - - - - - - - //
 //- - - - - CREATION - - - - - - //
// - - - - - - - - - - - - - - - //

/*
  Summary: Set up the levels[] array by loading it with pre-made LEVEL objects
*/
function initLevels()
{
  // levels.push(levelTallTest);
  // levels.push(levelTall);
  // levels.push(levelRainbowBridge);


  //Part 1 - Introduce Core Mechanics
  levelStart.slides = ['slidesIntro1','slidesIntro2', 'slidesIntro3', 'slidesIntro4'];
  levels.push(levelStart);
  levels.push(levelSep);
  levels.push(levelTeam);
  levels.push(levelCorner);
  levels.push(levelStuff2);
  // levels.push(levelSnake);
  
  //Part 2 - Enemies
  levelE.slides = ['slidesEnemy1', 'slidesEnemy2'];
  levels.push(levelE);
  levels.push(level2);
  levels.push(levelRampage);
  // levels.push(levelGrid);
  // levels.push(levelTower);
 
  //Part 3 - Boundaries
  levelOpenStart.slides = ['slidesEdges1', 'slidesEdges2'];
  levels.push(levelOpenStart);
  levels.push(levelOpen0);
  levels.push(levelOpen1);
  // levels.push(levelOpen2);
  // levels.push(levelOpen3);
 
  //Part 4 - Gates
  levelColored.slides = ['slidesGates1', 'slidesGates2'];
  levels.push(levelColored);
  levels.push(lvlBridge2);
  // levels.push(lvlGreenBridge);
  // levels.push(levelColored2); 
 
  //Part 5 - Switches
  levelSwitch.slides = ['slidesSwitches1', 'slidesSwitches2'];
  levels.push(levelSwitch);
  levels.push(levelSwitch2);
  levels.push(levelHard);
  //Brainy Hero
  //RainbowBridges



  // levels.push(mapMarco);
  // levels.push(levelBase);
  // levels.push(levelMaze); 
  
}


  // - - - - - - - - - - - - - - - //
 // - - - GAMEPLAY FUNCTIONS - - -//
// - - - - - - - - - - - - - - - //

/*
  Summary: Unloads the current level + loads the next level in the array
*/
function nextLevel()
{
  currentLevel++;
  
  //Check if we are out of levels!
  if(currentLevel+1 > levels.length){
    gameState = GAMESTATE_END
    youWin = true;
    deathType = "none";
    return;
  }
  
  if(levels[currentLevel].slides != null){
    gameState = GAMESTATE_INSTRUCTIONS;
    return;
  }1
  
  clearLevel();
  loadMap(levels[currentLevel]);
}

/*
  Summary: Given an index, load a SPECIFIC level
  (Note: used for level warping)
*/
function selectLevel(index)
{
  if(index<0 || index>=levels.length){
    console.log("level index "+index+" OUT OF BOUNDS");
    return;
  }

  currentLevel = index;
  clearLevel();
  loadMap(levels[currentLevel]);
}

/*
  Summary: Clear level reload the content
*/
function resetLevel()
{
  clearLevel();
  if(currentLevel == levels.length) currentLevel--;
  loadMap(levels[currentLevel]);
}

function resetGame()
{
  clearLevel();
  currentLevel = -1;
  gameState = GAMESTATE_MENU;
  stopInput();
}

/*
  Summary: reset all level variables + clear content
*/
function clearLevel()
{
  console.log("clearing level");
  // currentScreen.kill();
  currentScreen.visible = false;

  facing = "neutral";

  //clear arrays so they can be refilled
  blocks.removeAll();
  floorTiles.removeAll();
  enemies.removeAll();
  grayGates.removeAll();//clear colorless gates
  
  for(var i=0;i<switches.length;i++){
    switches[i].loadTexture('switch' + (i+1) + 'On');
    switches[i].active = false;
    switches[i].kill();
    // switches[i].destroy();
    switches[i].gates.removeAll();
  }

  //set velocities to 0
  heroSmart.body.velocity.x = 0;
  heroSmart.body.velocity.y = 0;
  heroKiller.body.velocity.x = 0;
  heroKiller.body.velocity.y = 0;
  heroSmart.body.acceleration.set(0);
  heroKiller.body.acceleration.set(0);
  
  heroSmart.moving = false;
  heroKiller.moving = false;

  heroSmart.angle = 0;
  heroKiller.angle = 0;
  goal1.angle = 0;
  goal2.angle = 0;

  heroSmart.body.immovable = true;
  heroKiller.body.immovable = true;
  
  numberOfMoves = 0;
  levelStartTime = null;
  levelElapsedSeconds = 0;
  levelStarted = false; 
  timeText.text = "0:00";

  //end all input!!
  stopInput();
}


/*
  Summary: Load content from a level map stored in the levels array
  GIVEN: level indes
*/
function loadMap(level)
{
  console.log("loading a map!");

  //Create the MAP!
  var currentMap = level.map;
  var w =  level.w;
  var h =  level.h;

  //CENTER the map
  var widthDiff = game.width - level.w*TILE_SIZE;
  var heightDiff = (game.height-uiBar.h) - level.h*TILE_SIZE;
  var xOffset = Math.floor(widthDiff/2);
  var yOffset = Math.floor(heightDiff/2);

  var startX = xOffset;
  var startY = uiBar.h + yOffset;

  for(i=0;i<h;i++)
  {
    for(j=0;j<w;j++)
    {
      var posX = j*TILE_SIZE + startX;
      var posY = i*TILE_SIZE + startY;
      var posCenterX = posX+32; //account for centered anchor
      var posCenterY = posY+32; //account for centered anchor

      if(currentMap[i*w+j] == '#') 
      {
        var block = blocks.create(posX,posY,'block');
        game.physics.enable(block, Phaser.Physics.ARCADE);
        block.body.immovable = true;
      }
      else if(currentMap[i*w+j] == 'E')
      {
          floorTiles.create(posX, posY, 'floor');

          var enemy = enemies.create(posX,posY,'enemy');
          game.physics.enable(enemy, Phaser.Physics.ARCADE);
      }
      else if(currentMap[i*w+j] == 'p')
      {
        floorTiles.create(posX, posY, 'floor');

        heroSmart.body.x = posX;
        heroSmart.body.y = posY;
      }
      else if(currentMap[i*w+j] == 'P')
      {
        floorTiles.create(posX, posY, 'floor');

        heroKiller.body.x = posX;
        heroKiller.body.y = posY;
      }
      else if(currentMap[i*w+j] == 'a')
      {
        goal1.x = posCenterX; //posX;
        goal1.y = posCenterY;//posY;
      }else if(currentMap[i*w+j] == 'b')
      {
        goal2.x = posCenterX;//posX;
        goal2.y = posCenterY;//posY;
      }
      else if(currentMap[i*w+j] == '1')
      {
        //switch 1
        switches[0].revive();
        switches[0].x = posX;// switches[0].body.x = posX;
        switches[0].y = posY;
      }
      else if(currentMap[i*w+j] == '2')
      {
        //switch 2
        switches[1].revive();
        switches[1].x = posX;
        switches[1].y = posY;

      }
      else if(currentMap[i*w+j] == '3')
      {
        //switch 3
        switches[2].revive();
        switches[2].x = posX;
        switches[2].y = posY;
      }
      else if(currentMap[i*w+j] == '4')
      {
        //switch 4
        switches[3].revive();
        switches[3].x = posX;
        switches[3].y = posY;
      }
      else if(currentMap[i*w+j] == '9' || currentMap[i*w+j] == '8' || currentMap[i*w+j] == '7' || currentMap[i*w+j] == '6' || currentMap[i*w+j] == '5')
      {
        
        //and assign it to the correct switch!
        if(currentMap[i*w+j] == '9')
        {
          //ORANGE
          var gate = switches[0].gates.create(posX,posY,'gate1On')
          game.physics.enable(gate, Phaser.Physics.ARCADE);
          gate.body.immovable = true;
          switches[0].active = true;
        }
        else if(currentMap[i*w+j] == '8')
        {
          //GREEN
          var gate = switches[1].gates.create(posX,posY,'gate2On')
          game.physics.enable(gate, Phaser.Physics.ARCADE);
          gate.body.immovable = true;
          switches[1].active = true;
        }
        else if(currentMap[i*w+j] == '7')
        {
          //YELLOW
          var gate = switches[2].gates.create(posX,posY,'gate3On')
          game.physics.enable(gate, Phaser.Physics.ARCADE);
          gate.body.immovable = true;
          switches[2].active = true;
        }
        else if(currentMap[i*w+j] == '6')
        {
          //PURPLE
          var gate = switches[3].gates.create(posX,posY,'gate4On')
          game.physics.enable(gate, Phaser.Physics.ARCADE);
          gate.body.immovable = true;
          switches[3].active = true;
        }
        else if(currentMap[i*w+j] == '5')
        {
          //Creates colorless gates
          var gate = grayGates.create(posX,posY,'gate0')
          game.physics.enable(gate, Phaser.Physics.ARCADE);
          gate.body.immovable = true;
        }
      }
      else{
        floorTiles.create(posX, posY, 'floor');
      }
    }
  }
}