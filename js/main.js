"use strict";

// Define global variables to be used in the game
var numPlatforms = 0;
var game;
var self;
var reloadOnGround = 0;
var style1 = { fontSize: '32px', fill: '#000' };
var style2 = { fontSize: '16px', fill: '#000' };
var palette = ['#1B1B3A', '#693668', '#A74482', '#F84AA7', '#FF3562', '#000'];
var textStyle = {
			font: 'Pacifico',
			fontSize: 24,
			wordWrap: true,
			wordWrapWidth: 586,
			fill: palette[4]
		};

var textStyle2 = {
			font: 'Indie Flower',
			fontSize: 48,
			wordWrap: true,
			wordWrapWidth: 586,
			fill: palette[5]
		};

var textStyle3 = {
			font: 'Fira Sans',
			fontSize: 20,
			wordWrap: true,
			wordWrapWidth: 586,
			fill: palette[5]
		};

// Wait for browser to load before creating Phaser game
window.onload = function() {

	// Define game
	game = new Phaser.Game(800, 600, Phaser.AUTO, 'myGame');
	
	// Define states
	game.state.add('Boot', Boot);
	game.state.add('Load', Load);
	game.state.add('MainMenu', MainMenu);
	game.state.add('Play', Play);
	game.state.add('Level2', Level2);
	game.state.add('Level3', Level3);
	game.state.add('GameOver', GameOver);
	game.state.add('TestingRealm', TestingRealm);

	// Start the game in the boot state
	game.state.start('Boot');
}







