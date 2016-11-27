//    ___                                                                
//   / _ \__ _ _ __ ___   ___    /\/\   __ _ _ __   __ _  __ _  ___ _ __ 
//  / /_\/ _` | '_ ` _ \ / _ \  /    \ / _` | '_ \ / _` |/ _` |/ _ \ '__|
// / /_\\ (_| | | | | | |  __/ / /\/\ \ (_| | | | | (_| | (_| |  __/ |   
// \____/\__,_|_| |_| |_|\___| \/    \/\__,_|_| |_|\__,_|\__, |\___|_|   
//                                                       |___/      

/*
  Summary: Manages main update loop and state-update loops (core,gameplay,instructions,menu,end)
  
  -also holds some asst. gameplay functions
*/


  // - - - - - - - - - - - - - - - //
 //- - - - - - UPDATE - - - - - - //
// - - - - - - - - - - - - - - - //

/*
  Summary: core game loop that updates all game logic X fps (X = target framerate)
*/
function update() 
{
  //(toggle debug)
  if(keyJustPressed("I")){
    debugging = !debugging;
  }

 //State Manager 
 if (gameState == GAMESTATE_MENU)
  {
    //MENU STATE
    updateMenu();
    
    //Manage State Transitions
    if(gameState == GAMESTATE_INSTRUCTIONS){
      drawScreen(levels[currentLevel].slides[0]);
    }
  }
  else if (gameState == GAMESTATE_GAMEPLAY)
  {
    //GAMEPLAY STATE
    updateGameplay();
    
    //Manage State Transitions
    if(gameState != GAMESTATE_GAMEPLAY)
    {
      //TEMP - band-aid solution (this is a crappy way to do this)
      stopInput();
    }
    if(gameState == GAMESTATE_END){
      drawGameOver();
    }
    else if(gameState == GAMESTATE_MENU){
      drawScreen("imageTitle");
    }
    else if(gameState == GAMESTATE_INSTRUCTIONS){
      drawScreen(levels[currentLevel].slides[0]);
    }
  }
  else if(gameState == GAMESTATE_INSTRUCTIONS)
  {
    //INSTRUCTIONS STATE
    updateInstructions();
  }
  else if(gameState == GAMESTATE_END)
  {
    //END STATE
    updateGameOver();//GameLogic.js
    
    //Manage State Transitions
    if(gameState == GAMESTATE_MENU){
      drawScreen("imageTitle");
    }
  }

  //ROUND all values (to fix stupid phaser physics stuff)
  heroSmart.body.x = Math.round(heroSmart.body.x);
  heroSmart.body.y = Math.round(heroSmart.body.y);
  heroKiller.body.x = Math.round(heroKiller.body.x);
  heroKiller.body.y = Math.round(heroKiller.body.y);
  //NOTE: until physics-style movement of brainy/brawny is removed, this rounding is needed due to weird buggy phaser stuff

  //clean out all saved input fields!
  clearInput();
}




  // - - - - - - - - - - - - - - - //
 //- - - - - UPDATE GAME- - - - - //
// - - - - - - - - - - - - - - - //


/*
  Summary: Update game logic in during play
*/
function updateGameplay(modifier)
{
  //Press 'R' to reset the level
  if(keyJustPressed("R") || rButtonPressed){
    resetLevel();
    return;
  }

  //Press 'N' to 
  if(keyJustPressed("N")) {
    nextLevel();
    return;
  }

  if(keyJustPressed(String.fromCharCode(13)) && lvlStr != ""){
    selectLevel(parseInt(lvlStr,10)-1);
    lvlStr = "";
    return;
  }

  processGameInput();

  movePlayer();

  checkPlayerCollision(); //physics.js

  updateHUD();
}

/*
  Summary: Process all input related to core gameplay
*/
function processGameInput()
{
  //Update "level string" based on numbers typed
  if(keyCodeJustPressed(48))
    lvlStr += "0";
  else if(keyCodeJustPressed(49))
    lvlStr += "1";
  else if(keyCodeJustPressed(50))
    lvlStr += "2";
  else if(keyCodeJustPressed(51))
    lvlStr += "3";
  else if(keyCodeJustPressed(52))
    lvlStr += "4";
  else if(keyCodeJustPressed(53))
    lvlStr += "5";
  else if(keyCodeJustPressed(54))
    lvlStr += "6";
  else if(keyCodeJustPressed(55))
    lvlStr += "7";
  else if(keyCodeJustPressed(56))
    lvlStr += "8";
  else if(keyCodeJustPressed(57))
    lvlStr += "9";

  //Process PLAYER input
  if(!heroSmart.moving && !heroKiller.moving)
  {
    //Handle SWIPE input!!
    swipeDirection = justSwiped();
    if(swipeDirection != "None") console.log("FINGER SWIPE: " + swipeDirection);
  }
}

function movePlayer()
{
  //Don't move unless they're both still/ready
  if(heroSmart.moving || heroKiller.moving)
  {
    //someone is moving - GET OUT!!
    return;
  }

  var vx = 0;
  var vy = 0;
  var ax = 0;
  var ay = 0;
  var targetAngle = 0; //used to rotate

  //1. What direction do we want to go in?
  if(((keyIsDown("&") || keyIsDown("W")) && facing!="North"&&facing!="neutral")
      || keyJustPressed("&") || keyJustPressed("W") || swipeDirection=="North")
  {
    facing = "North";
    vy = -PLAYER_SPEED;
    ay = -PLAYER_ACC;
    targetAngle = 180;
  }
  else if(((keyIsDown("(") || keyIsDown("S")) && facing!="South"&&facing!="neutral")
            || keyJustPressed("(") || keyJustPressed("S") || swipeDirection=="South")
  {
    facing = "South";
    vy = PLAYER_SPEED;
    ay = PLAYER_ACC;
    targetAngle = 0;
  }
  else if (((keyIsDown("%") || keyIsDown("A")) && facing!="West"&&facing!="neutral")
            || keyJustPressed("%") || keyJustPressed("A") || swipeDirection=="West")
  {
    facing = "West";
    vx = -PLAYER_SPEED;
    ax = -PLAYER_ACC;
    targetAngle = 90;
  }
  else if (((keyIsDown("'") || keyIsDown("D")) && facing!="East"&&facing!="neutral")
            || keyJustPressed("'") || keyJustPressed("D") || swipeDirection=="East")
  {
    facing = "East";
    vx = PLAYER_SPEED;
    ax = PLAYER_ACC;
    targetAngle = 270;
  }
  else
  {
    //player is not attempting to move. retreat!
    return;
  }

  //ROTATE the sprites
  // heroSmart.angle = targetAngle;
  // heroKiller.angle = targetAngle;
  // goal1.angle = targetAngle;
  // goal2.angle = targetAngle;


  //2. Can the players move? (If we got this far, we are attempting to move brainy and brawny.)

  //check against solid objects
  var brainyCanMove = canMove(heroSmart,facing);
  var brawnyCanMove = canMove(heroKiller,facing);

  //check against each other
  if(brainyCanMove && !brawnyCanMove) brainyCanMove = canMove2(heroSmart,facing);
  if(brawnyCanMove && !brainyCanMove) brawnyCanMove = canMove2(heroKiller,facing);


  //if someone moving, update the MOVE counter
  if(brainyCanMove || brawnyCanMove)
  {
    numberOfMoves++;

    if(brainyCanMove){
      //move brainy!
      heroSmart.body.immovable = false;
      // heroSmart.body.velocity.x = vx;
      // heroSmart.body.velocity.y = vy;
      heroSmart.body.acceleration.x = ax;
      heroSmart.body.acceleration.y = ay;
      heroSmart.moving = true;
    }
    if(brawnyCanMove){  
      //move brawny!
      heroKiller.body.immovable = false;
      // heroKiller.body.velocity.x = vx;
      // heroKiller.body.velocity.y = vy;
      heroKiller.body.acceleration.x = ax;
      heroKiller.body.acceleration.y = ay;
      heroKiller.moving = true;
    }

    if(!levelStarted){
      levelStarted = true;
      levelStartTime = game.time.now; //saves the start time of the level for future calculations
    }
  }
}


function updateHUD()
{
  // - - - UPDATE HUD TEXT - - - //

  //Display Current Level
  levelText.text = ""+(currentLevel+1);
  
  //Display # of Moves
  if(numberOfMoves <= 9){ 
    moveText.text = "0"+numberOfMoves;
  }
  else{ 
    moveText.text = ""+numberOfMoves;
  }

  //Display Time Ellapsed since level start!
  if(levelStarted)
  {
    levelElapsedSeconds = Math.floor(game.time.elapsedSecondsSince(levelStartTime));
    var secondsToDraw = levelElapsedSeconds%60;
    var minutesToDraw = (levelElapsedSeconds - secondsToDraw)/60
    if(secondsToDraw <= 9)
      timeText.text = minutesToDraw + ":0" + secondsToDraw;
    else
      timeText.text = minutesToDraw + ":" + secondsToDraw;
  }
}


  // - - - - - - - - - - - - - - - //
 //- - - GAMEPLAY FUNCTIONS - - - //
// - - - - - - - - - - - - - - - //


/*
  Summary: Kill the player and end the game!
*/
function killPlayer(type)
{
  gameState = GAMESTATE_END;
  youWin = false;
  deathType = type;
  stopInput();
  playSound('death');
}

/*
  Summary: "Activate" a given switch (disable all matching gates)
  Given: index of the target switch
*/
function activateSwitch(target)
{
  switches[target].active = false;
  console.log("switches[" + target + "].active = " + switches[target].active)

  //change out textures (inefficient... switch with FRAME data
  switches[target].loadTexture('switch' + (target+1) + 'Off');
  switches[target].gates.forEach(function(gate){
    gate.loadTexture('gate' + (target+1) + 'Off');
  });
}






  // - - - - - - - - - - - - - - - //
 //- - - - -UPDATE SLIDES - - - - //
// - - - - - - - - - - - - - - - //


/*
  Summary: If "N" is pressed - advance to the next slide. If there are no more slides, start the level!
  (Note: this is a pretty janky way of starting levels... should update this)
*/
function updateInstructions()
{
  if(keyJustPressed("N") || keyJustPressed(String.fromCharCode(13)) || screenTapped()){
    currentSlide++;
    playSound('select');
    
    if(currentSlide >= levels[currentLevel].slides.length){
      gameState = GAMESTATE_GAMEPLAY;
      //redrawUI = true;
      currentSlide = 0;
      resetLevel();
    }
    else
    {
      drawScreen(levels[currentLevel].slides[currentSlide]);
    }
  }
}


  // - - - - - - - - - - - - - - - //
 //- - - - - UPDATE MENU - - - - -//
// - - - - - - - - - - - - - - - //


/*
  Summary: Advance from menu to gameplay (temp)
*/
function updateMenu()
{
  if (anyKeyJustPressed() || screenTapped())
  {
    playSound('select');
    gameState = GAMESTATE_GAMEPLAY;
    nextLevel();
  }
}


  // - - - - - - - - - - - - - - - //
 //- - - -UPDATE END STATE- - - - //
// - - - - - - - - - - - - - - - //


/*
  Summary: Process input that occurs during the GAME OVER screen
*/
function updateGameOver()
{
  if(keyJustPressed("R") || (screenTapped() && !youWin)) {
    gameState = GAMESTATE_GAMEPLAY
    resetLevel();
  }
  else if(screenTapped() && youWin)
  {
    //reset the game!
    resetGame();
  }
}