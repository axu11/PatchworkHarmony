"use strict";

// Define global variables to be used in the game
var game;
var self;
var reloadOnGround = 0;
var maxPlatforms = 0;
var elevatorActivated = false;
var inElevator = false;
var leverActivated = false;
var cutscenePlaying = false;
var wallShifted = false;
var playedCutscene5 = false;
var playedCutscene6 = false;
var hasThirdGear = false;
var style1 = { fontSize: '32px', fill: '#000' };
var style2 = { fontSize: '16px', fill: '#000' };
var palette = ['#1B1B3A', '#693668', '#A74482', '#F84AA7', '#FF3562', '#000', '#FFFFFF'];
var textStyle = {
			font: 'Gaegu',
			fontSize: 40,
			wordWrap: true,
			wordWrapWidth: 586,
			fill: palette[6]
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
	game.state.add('Intro', Intro);
	game.state.add('Play', Play);
	game.state.add('Level2', Level2);
	game.state.add('Level3', Level3);
	game.state.add('Level4', Level4);
	game.state.add('Level5', Level5);
	game.state.add('Level7', Level7);
	game.state.add('Credits', Credits);

	game.state.add('GameOver', GameOver);
	game.state.add('TestingRealm', TestingRealm);

	// Start the game in the boot state
	game.state.start('Boot');
}







