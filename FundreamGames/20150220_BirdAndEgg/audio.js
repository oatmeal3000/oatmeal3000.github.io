//    _             _ _       
//   /_\  _   _  __| (_) ___  
//  //_\\| | | |/ _` | |/ _ \ 
// /  _  \ |_| | (_| | | (_) |
// \_/ \_/\__,_|\__,_|_|\___/ 
                    
/*
	Summary: Handles audio loading and manipulation
*/       

  // - - - - - - - - - - - - - - - //
 //- - - - - Preloading - - - - - //
// - - - - - - - - - - - - - - - //

/*
	Summary: loads audio files into the game
*/
function loadSounds()
{
	// game.load.audio('thunk','sound/blop_2.wav');
	game.load.audio('thunk','sound/rs.mp3');
	game.load.audio('select','sound/select_2.wav');
	game.load.audio('switch','sound/switch_2.wav');
	game.load.audio('death','sound/death_2.wav');
	game.load.audio('finish','sound/finish_2.wav');
	game.load.audio('kill','sound/kill_2.wav');

	//TODO: include backup files (ogg?)
	//TODO: switch wav to mp3 (faster loading?)
}


  // - - - - - - - - - - - - - - - //
 //- - - - - Play Sound - - - - - //
// - - - - - - - - - - - - - - - //

function playSound(snd)
{
  var sound = game.add.audio(snd);
  sound.play();
}