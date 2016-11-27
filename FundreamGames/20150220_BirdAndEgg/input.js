/*
          _____                   _   
          \_   \_ __  _ __  _   _| |_ 
           / /\/ '_ \| '_ \| | | | __|
        /\/ /_ | | | | |_) | |_| | |_ 
        \____/ |_| |_| .__/ \__,_|\__|
*/

/*
  Summary: Handles input from keyboard, mouse, and touch
*/

  // - - - - - - - - - - - - - - - //
 //- - - - HANDLE KEYBOARD - - - -//
// - - - - - - - - - - - - - - - //
var keysDown = {};

/*
  Summary: Fired when a key is down - used to update keysDown array
*/
function keyDownHandler(e)
{
  if(!(e.keyCode in keysDown)){
    keysDown[e.keyCode] = 1; //just pressed
    //keysPressedThisFrame.push(e.keyCode);
  }
  if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 
      || e.keyCode == 40) 
  {
    e.preventDefault();
  }
}


/*
  Summary: Fired when a key is released - used to update keysDown array
*/
function keyUpHandler(e)
{
  delete keysDown[e.keyCode];
}


/*
  Summary: Return true if target key is DOWN (held or just pressed)
*/
function keyIsDown(target)
{
  var keyCode = target.charCodeAt(0);
  
  if(keyCode in keysDown){
    return true;
  }
  
  return false;
}

/*
  Summary: Return true if target key was JUST PRESSED (down this frame, up previous frame)
  Given: character representing the desired key (use keycode transfer)
*/
function keyJustPressed(target)
{
  var keyCode = target.charCodeAt(0);
  
  if(keyCode in keysDown){
    if(keysDown[keyCode] == 1){
      return true;
    }
  }
  
  return false;
}

/*
  Summary: Return true if target key was JUST PRESSED (down this frame, up previous frame)
  Given: Number representing desired keyCode
  (Note: Only needed because some characters don't convert properly in "keyJustPressed()"
*/
function keyCodeJustPressed(keyCode)
{
  if(keyCode in keysDown){
    if(keysDown[keyCode] == 1){
      return true;
    }
  }
  
  return false;
}

/*
  Summary: Return true if ANY key on the keyboard was JUST PRESSED
*/
function anyKeyJustPressed()
{
  for(var key in keysDown)
  {
    if(keysDown.hasOwnProperty(key)){
      if(keysDown[key]==1)
        return true;
    }
  }

  return false;
}



  // - - - - - - - - - - - - - - - //
 //- - - - - HANDLE MOUSE- - - - -//
// - - - - - - - - - - - - - - - //

// var isClicked, mouseX, mouseY;

// function canvasClick(event)
// {  
//  mouseX = event.clientX - game.offsetLeft + document.body.scrollLeft;
//  mouseY = event.clientY - game.offsetTop + document.body.scrollTop;
  
//  isClicked = true;
// }



  // - - - - - - - - - - - - - - - //
 //- - - - - HANDLE TOUCH- - - - -//
// - - - - - - - - - - - - - - - //
var screenWasTapped = false;
var restartButton;
var rButtonPressed = false;

var firstPointX;
var firstPointY;
var lastPointX;
var lastPointY;

var checkSwipeX;
var checkSwipeY;

var swipeDirection = "None";

var lastStopInputTime = 0;

/*
  Summary: called when pointer tap is registered (or quick mouseclick)
*/
function tapHandler()
{
  if(!touchedBeforeStop())
  {
    screenWasTapped = true;
  }
}

/*
  Summary: Accessor - Returns value of "screenWasTapped"
*/
function screenTapped()
{
  return screenWasTapped;
}

/*
  Summary: Checks for a valid CARDINAL SWIPE
*/
function justSwiped()
{
  if(numberOfMoves == 0)
  {
    //this is the first move - make sure the swipe didn't start before the levelstarted!
    if(touchedBeforeStop())
    {
      return "None";
    }
  }

  //constants (temp location)
  var pointDistance = 65//100//150;
  var dirDistance = 50//100//150;
  var durMin = 50;
  var durMax = 150;

  if (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > pointDistance && game.input.activePointer.duration > durMin && game.input.activePointer.duration < durMax)
  {
    //1. Get our point variables
    firstPointX = game.input.activePointer.positionDown.x;
    firstPointY = game.input.activePointer.positionDown.y;
    
    lastPointX = game.input.activePointer.position.x;
    lastPointY = game.input.activePointer.position.y;

    //2. Determine the DIRECTION
    var checkSwipeX = Math.abs(firstPointX - lastPointX);
    var checkSwipeY = Math.abs(firstPointY - lastPointY);
    if(checkSwipeX > checkSwipeY && checkSwipeX >= dirDistance)
    {
      //moving in the X direction

      if(firstPointX > lastPointX)
      {
        return "West";
      } 
      else if(firstPointX < lastPointX)//this can be "else"
      {
        return "East";
      }
    }
    else if(checkSwipeY > checkSwipeX && checkSwipeY >= dirDistance)
    {
      //moving in the Y direction
      if(firstPointY > lastPointY)
      {
        return "North";
        
      } else if(firstPointY < lastPointY)//this can be "else"
      {
        return "South";
      }
    }
    
    
        
  }

  return "None";//no swipe fo you.
}

function restartButtonHandler()
{
  rButtonPressed = true;
}


/*
  Summary: Clear the keyDown Called at the end of every frame - clears the 
*/
function clearInput()
{
  for(var keyCode in keysDown){
    if(keysDown[keyCode] == 1){
      keysDown[keyCode] = 2;
    }
  }

  screenWasTapped = false;
  rButtonPressed = false;
}

/*
  Summary: Used to manage input interruptions in handlers
  (right now it is just for swipes)
*/
function stopInput()
{
  clearInput();
  lastStopInputTime = game.time.now;
}

function touchedBeforeStop()
{
  return game.input.activePointer.duration > game.time.now - lastStopInputTime;
}