//    __                _           
//   /__\ ___ _ __   __| | ___ _ __ 
//  / \/// _ \ '_ \ / _` |/ _ \ '__|
// / _  \  __/ | | | (_| |  __/ |   
// \/ \_/\___|_| |_|\__,_|\___|_|   

/*
  Summary: Handles the loading and drawing of images/graphics/screen
*/
                                  

  // - - - - - - - - - - - - - - - //
 //- - - - - Preloading - - - - - //
// - - - - - - - - - - - - - - - //

/*
  Summary: preload all necessary images into the game (static + dynamic)
*/
function loadImages()
{
  //NOTE: order of statements == draw order

  /*
    STEP 1 - Load Dynamic Images (stuff that moves)
  */
  
  //load blocks + floor
  game.load.image('floor','images/floor.png'); //1,0
  game.load.image('block', 'images/block.png'); //0,0

  //load Brainy and Brawny (player avatars)
  // game.load.image('brainy', 'images/pBrainy.png'); //0,2
  // game.load.image('brawny', 'images/pBrawny.png'); //0,3
  game.load.image('brainy', 'images/pBrainy.png'); //0,2
  game.load.image('brawny', 'images/pBrawny.png'); //0,3

  //load goal images
  game.load.image('goalBrainy','images/goalBrainy.png'); //1,2
  game.load.image('goalBrawny','images/goalBrawny.png'); //1,3

  //Switch Images
  game.load.image('switch1On','images/switch1On.png'); //2,0
  game.load.image('switch1Off','images/switch1Off.png'); //2,1
  game.load.image('switch2On','images/switch2On.png'); //2,2
  game.load.image('switch2Off','images/switch2Off.png'); //2,3
  game.load.image('switch3On','images/switch3On.png'); //3,0
  game.load.image('switch3Off','images/switch3Off.png'); //3,1
  game.load.image('switch4On','images/switch4On.png'); //3,2
  game.load.image('switch4Off','images/switch4Off.png'); //3,3

  //gate images
  game.load.image('gate0','images/gate0.png'); //0,1
  game.load.image('gate1On','images/gate1On.png'); //4,0
  game.load.image('gate1Off','images/gate1Off.png'); //4,1
  game.load.image('gate2On','images/gate2On.png'); //4,2
  game.load.image('gate2Off','images/gate2Off.png'); //4,3
  game.load.image('gate3On','images/gate3On.png'); //5,0
  game.load.image('gate3Off','images/gate3Off.png'); //5,1
  game.load.image('gate4On','images/gate4On.png'); //5,2
  game.load.image('gate4Off','images/gate4Off.png'); //5,3

  //enemy image
  game.load.image('enemy','images/octopus.png'); //2,2


  /*
    STEP 2 - Load Static Images (screens/etc)
  */

  //instruction slides
  game.load.image('slidesIntro1','images/screens_mobile-03.png');
  game.load.image('slidesIntro2','images/screens_mobile-04.png');
  game.load.image('slidesIntro3','images/screens_mobile-05.png');
  game.load.image('slidesIntro4','images/screens_mobile-06.png');

  game.load.image('slidesEnemy1','images/screens_mobile-09.png');
  game.load.image('slidesEnemy2','images/screens_mobile-10.png');

  game.load.image('slidesEdges1','images/screens_mobile-07.png');
  game.load.image('slidesEdges2','images/screens_mobile-08.png');


  game.load.image('slidesGates1','images/screens_mobile-11.png');
  game.load.image('slidesGates2','images/screens_mobile-12.png');

  game.load.image('slidesSwitches1','images/screens_mobile-13.png');
  game.load.image('slidesSwitches2','images/screens_mobile-14.png');

  game.load.image('missionFailScreen1','images/screens_mobile-15.png');
  game.load.image('missionFailScreen2','images/screens_mobile-17.png');
  game.load.image('missionSuccessScreen','images/screens_mobile-16.png');

  //HUD & Title && reset button
  game.load.image('imageHUD','images/HUD-02.png');
  game.load.spritesheet('rButton', 'images/HUD-04.png',60,60);
  game.load.image('imageTitle','images/screens_mobile-01.png');
}


  // - - - - - - - - - - - - - - - //
 //- - - - - GAME LOOP   - - - - -//
// - - - - - - - - - - - - - - - //

/*
  Summary: core render loop, called AFTER update() each frame, that renders secondary such as DEBUG overlays
*/
function render()
{
  // - - - DEBUG VISUALS - - - //
  // if(debugging){

    game.debug.text("This is a demo.",10,980);
    // game.debug.body(heroSmart);
    // game.debug.body(heroKiller);
    // game.debug.spriteInfo(heroSmart,0,80);

  // }
}



  // - - - - - - - - - - - - - - - //
 //- - - - - DRAW FUNCTIONS - - - //
// - - - - - - - - - - - - - - - //

/*
  Summary: Draw a given screen texture (slide or menu screen) over all other content
*/
function drawScreen(screen)
{
  currentScreen.loadTexture(screen,0);
  currentScreen.visible = true;
}

/*
  Summary: Draw the approriate END screen based on how the game was ended
    1. mission success
    2. Boundary Death
    3. Enemy Death
*/
function drawGameOver()
{
	console.log("game is over!");

	if(youWin){
    drawScreen('missionSuccessScreen')
  }else{
    if(deathType == "boundary")
      drawScreen('missionFailScreen1');
    else if(deathType == "enemy")
      drawScreen('missionFailScreen2');
  }
}