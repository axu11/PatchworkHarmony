"use strict";

// Define global variables to be used in the game
var numPlatforms = 0;
var game;
var style1 = { fontSize: '32px', fill: '#000' };
var style2 = { fontSize: '16px', fill: '#000' };

// Wait for browser to load before creating Phaser game
window.onload = function() {

	// Define game
	game = new Phaser.Game(800, 600, Phaser.AUTO, 'myGame');
	
	// Define states
	game.state.add('Boot', Boot);
	game.state.add('Load', Load);
	game.state.add('MainMenu', MainMenu);
	game.state.add('Play', Play);
	game.state.add('GameOver', GameOver);

	// Start the game in the boot state
	game.state.start('Boot');
}







