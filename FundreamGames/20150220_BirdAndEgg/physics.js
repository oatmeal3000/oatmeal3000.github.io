//    ___ _               _          
//   / _ \ |__  _   _ ___(_) ___ ___ 
//  / /_)/ '_ \| | | / __| |/ __/ __|
// / ___/| | | | |_| \__ \ | (__\__ \
// \/    |_| |_|\__, |___/_|\___|___/
//              |___/              

/*
  Summary: Handles physics calculations (such as collision)
*/

  // - - - - - - - - - - - - - - - //
 //- - - COLLISION FUNCTIONS - - -//
// - - - - - - - - - - - - - - - //

/*
  Summary: Checks brainy and brawny against different things
*/
function checkPlayerCollision()
{
  //Note: if we are in this function, it is assumed that either Brainy or Brawny is MOVING

  //Check Player Collision (only if player is moving)
  if(!heroSmart.moving && !heroKiller.moving)
  {
    //no one is moving - GET OUT
    return;
  }

  //Only if they are BOTH moving:
  if(heroSmart.moving || heroKiller.moving)
  {
    //Check players against GOALS (win condition)
    if(game.physics.arcade.overlap(heroSmart,goal1) && game.physics.arcade.overlap(heroKiller,goal2)){
      playSound('finish');
      nextLevel();
      return;
    }

    //Check players against Boundaries
    if(heroSmart.body.x+TILE_SIZE < 0 || heroSmart.body.x > game.width || heroSmart.body.y+TILE_SIZE < uiBar.h || heroSmart.body.y > game.height
       || heroKiller.body.x+TILE_SIZE < 0 || heroKiller.body.x > game.width || heroKiller.body.y+TILE_SIZE < uiBar.h || heroKiller.body.y > game.height )
    {
      killPlayer("boundary");
      return;
    }
  }

  // //DEBUG: used to mark colliding blocks
  // if(debugging) blocks.setAll('alpha',1);

  //Used to determine whether or not a "thunk" sound should be made
  //Note: using this variable prevents the sound from stacking
  var isThunking = false; 
  var brainyCollideType = "";
  var brawnyCollideType = "";

  if(heroSmart.moving)
  {
    brainyCollideType = checkBrainyCollision();

    if(brainyCollideType == "stop")
    {
      isThunking = true;
      //round values off?
      heroSmart.moving = false;
      heroSmart.body.immovable = true;
      heroSmart.body.acceleration.set(0);
    }
  }

  if(heroKiller.moving)
  {
    brawnyCollideType = checkBrawnyCollision();

    if(brawnyCollideType == "stop")
    {
      isThunking = true;
      // heroKiller.body.velocity.x = Math.round(heroKiller.body.velocity.x);
      // heroKiller.body.velocity.y = Math.round(heroKiller.body.velocity.y);
      heroKiller.moving = false;
      heroKiller.body.immovable = true;
      heroKiller.body.acceleration.set(0);
    }
  }




  if(heroSmart.moving && !heroKiller.moving)
  {
    if(game.physics.arcade.collide(heroSmart,heroKiller))
    {
      isThunking = true;
      //round values off?
      heroSmart.moving = false;
      heroSmart.body.immovable = true;
      heroSmart.body.acceleration.set(0);
      heroKiller.body.acceleration.set(0);
    }    
  }
  
  if(!heroSmart.moving && heroKiller.moving)
  {
    if(game.physics.arcade.collide(heroKiller,heroSmart))
    {
      isThunking = true;
      //round values off?
      heroKiller.moving = false;
      heroKiller.body.immovable = true;
      heroSmart.body.acceleration.set(0);
      heroKiller.body.acceleration.set(0);
    }    
  }

  //All thunkable things have been checked, so play the sound if appropriate :)
  if(isThunking) playSound('thunk');
}

//Check to see if Brainy is collidng with things!
function checkBrainyCollision()
{
  //check Brainy against ENEMIES
  if(game.physics.arcade.overlap(heroSmart,enemies,function(){
    killPlayer("enemy");
  }))
  {
    return "death";
  }

  //Check Brainy against SWITCHES
  for(i=0;i<switches.length;i++)
  {
      if(switches[i].active && game.physics.arcade.overlap(heroSmart,switches[i]))
      {
          activateSwitch(i);
          playSound('switch');
      }
  }

  //Check Brainy against BLOCKS
  if(game.physics.arcade.collide(heroSmart, blocks)){
    return "stop";
  }

  // if(!heroKiller.moving)
  // {
  //   console.log("heroKiller stopped moving");
  //   // debugger;
  //   if(game.physics.arcade.collide(heroSmart,heroKiller))
  //   {
  //     // debugger;
  //     return "stop";
  //   }
  //   if(game.physics.arcade.overlap(heroSmart,heroKiller))
  //   {
  //     console.log("overlapping");
  //   }
  // }

  return "nothing"
}


function checkBrawnyCollision()
{
  //Check brawny against ENEMIES
  game.physics.arcade.overlap(heroKiller,enemies,function(heroKiller,enemy){
    playSound('kill');
    enemy.destroy();
  });

  //Check Brawny against GRAY GATES
  if(game.physics.arcade.collide(heroKiller,grayGates)){
    return "stop";
  }

  //Check brawny against COLORED GATES
  for(var i=0;i<switches.length;i++)
  {
    if(switches[i].active){
      if(game.physics.arcade.collide(heroKiller,switches[i].gates)){
        return "stop";
      }
    }
  }

  //Check Brawny against BLOCKS
  if(game.physics.arcade.collide(heroKiller, blocks))
  {
    return "stop";
  }

  // if(!heroSmart.moving)
  // {
  //   if(game.physics.arcade.collide(heroKiller,heroSmart))
  //   {
  //     // debugger;
  //     return "stop";
  //   }
  // }

  return "nothing"
}

/*
  Summary: Debug function (changes alpha to mark collided blocks)
*/
function handleBlockCollision(hero,block)
{
  if(debugging) {
    block.alpha = 0.5;
  }
}


/*
    Summary (version 1): Checks to see if a given physicslayer can move in a certain direction.
    Current: Iterate through all blocks and gates to check for a collision
    TODO: Check the ABOVE tile in the array for a "#" (much more efficient)
*/
function canMove(player, facing)
{
  //TEMP: this function is under construction
  // return true;

  //create a small rectangle for collision testing
  var rectSize = 20;
  var rectOffset = (TILE_SIZE-rectSize)/2;

  //implement new stuff for this :D
  var rect = new Phaser.Rectangle(player.body.x+rectOffset,player.body.y+rectOffset,rectSize,rectSize);

  //shift the rectangle one tile over in the desired direction
  if(facing == "North"){
    rect.y -= TILE_SIZE;
  }else if(facing == "South"){
    rect.y += TILE_SIZE;
  }else if(facing == "West"){
    rect.x -= TILE_SIZE;
  }else if(facing == "East"){
    rect.x += TILE_SIZE;
  }else{
    console.log("ERROR: facing was not set correctly");
  }
  // console.log("AFTER rectX:" + rect.x + ",rectY:" + rect.y);

  //Check against blocks
  for(var i=0;i<blocks.length;i++)
  {
    if(Phaser.Rectangle.intersects(rect,blocks.getAt(i).body)){
      console.log("cannot move:" + player.name)
      return false;
    }
  }

  //for Brawny ONLY - check gates
  if(player.name == "Brawny"){
    //test Brawny against colored gates
    for(i=0;i<switches.length;i++)
    { 
      if(switches[i].active)
      {
        for(var j=0;j<switches[i].gates.length;j++){
          if(Phaser.Rectangle.intersects(rect,switches[i].gates.getAt(j).body)){
            console.log("Brawny cannot move because of a GATE");
            return false; 
          }
        }
      }
    }

    //test Brawny against gray gates
    for(var i=0;i<grayGates.length;i++){
      if(Phaser.Rectangle.intersects(rect,grayGates.getAt(i).body)){
        console.log("Brawny cannot move because of a GATE");
        return false; 
      }
    }
  }

  // //test against each other
  // if(player.name == "Brainy"){
  //   if(Phaser.Rectangle.intersects(rect,heroKiller.body)){
  //     console.log("Brainy cannot move because of BRAWNY");
  //     return false; 
  //   }
  // }
  // else if(player.name == "Brawny"){
  //   if(Phaser.Rectangle.intersects(rect,heroSmart.body)){
  //     console.log("Brawny cannot move because of BRAINY");
  //     return false; 
  //   }
  // }

  return true;
}

/*
    Summary: Specialized - used to check against each other
*/
function canMove2(player, facing)
{ 

  //create a small rectangle for collision testing
  var rectSize = 20;
  var rectOffset = (TILE_SIZE-rectSize)/2;

  //implement new stuff for this :D
  var rect = new Phaser.Rectangle(player.body.x+rectOffset,player.body.y+rectOffset,rectSize,rectSize);

  //shift the rectangle one tile over in the desired direction
  if(facing == "North"){
    rect.y -= TILE_SIZE;
  }else if(facing == "South"){
    rect.y += TILE_SIZE;
  }else if(facing == "West"){
    rect.x -= TILE_SIZE;
  }else if(facing == "East"){
    rect.x += TILE_SIZE;
  }else{
    console.log("ERROR: facing was not set correctly");
  }

  //test against each other
  if(player.name == "Brainy"){
    if(Phaser.Rectangle.intersects(rect,heroKiller.body)){
      console.log("Brainy cannot move because of BRAWNY");
      return false; 
    }
  }
  else if(player.name == "Brawny"){
    if(Phaser.Rectangle.intersects(rect,heroSmart.body)){
      console.log("Brawny cannot move because of BRAINY");
      return false; 
    }
  }

  return true;
}