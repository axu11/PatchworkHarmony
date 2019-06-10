// MainMenu state used to display the game premise and title
var MainMenu = function(game) {};
MainMenu.prototype = {
	create: function() {
		// Temp background and placeholder text instructions
		//game.stage.backgroundColor = "#facade";
		
		// Add background
		this.bg = game.add.image(0, 0, 'bg0');
		this.bg.alpha = 0.9;

		// Add game logo
		this.logo = game.add.image(200, 100, 'logo');
		this.logo.scale.setTo(0.5);

		// Add menu music
		this.bgm = game.add.audio('menu', 0.2, true);
		this.bgm.play();

		// this.title = game.add.text(game.world.centerX, 200, 'PATCHWORK HARMONY', textStyle2);
		// this.title.anchor.set(0.5);
		// this.description = game.add.text(game.world.centerX, 270, 'You are a toy bunny! Reunite the magic music box with its owner!', textStyle3);
		// this.description.anchor.set(0.5);
		
		// Add developer title
		this.devTitle = game.add.text(game.world.width - 10, game.world.height, 'Developed by Grapple Studio');
		this.devTitle.anchor.set(1);
		this.devTitle.font = 'Gaegu';
		this.devTitle.fontSize = 20;

		// Add start instructions
		this.startInstructions = game.add.text(game.world.centerX, 400, 'Press spacebar to play!');
		this.startInstructions.anchor.set(0.5);
		this.startInstructions.font = 'Gaegu';
		this.startInstructions.fontSize = 40;
	},

	update: function() {
		// Go to Play state once SPACEBAR pressed
		// game.state.start('Play', true, false, false, 0, 0);
			// game.state.start('Level2', true, false, false, 1, 0);
			game.state.start('Level3', true, false, false, 2, 0);
			// game.state.start('Level4', true, false, false, 2, 0);
			// game.state.start('Level5', true, false, false, 2, 0);
			this.bgm.destroy();
			// game.state.start('Level7', true, false, false, 3, 0);
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.camera.fade(0x000000, 4000);
			game.time.events.add(Phaser.Timer.SECOND * 4, transitionToCutscenes, this);
			
		}
	}
}

function transitionToCutscenes(){
	this.bgm.destroy();
	game.state.start('Intro');
}