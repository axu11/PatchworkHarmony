// MainMenu state used to display the game premise and title
var MainMenu = function(game) {};
MainMenu.prototype = {
	create: function() {
		// Temp background and placeholder text instructions
		//game.stage.backgroundColor = "#facade";
		game.add.image(-800, -800, 'bg');
		this.bgm = game.add.audio('menu', 0.1, true);
		this.bgm.play();
		this.title = game.add.text(game.world.centerX, 200, 'PATCHWORK HARMONY', textStyle2);
		this.title.anchor.set(0.5);
		this.description = game.add.text(game.world.centerX, 270, 'You are a toy bunny! Reunite the magic music box with its owner!', textStyle3);
		this.description.anchor.set(0.5);
		this.startInstructions = game.add.text(game.world.centerX,300, 'Press SPACEBAR to play!', textStyle3);
		this.startInstructions.anchor.set(0.5);
	},

	update: function() {
		// Go to Play state once SPACEBAR pressed
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.bgm.destroy();
			// game.state.start('Play');
			game.state.start('Level2');
			// game.state.start('Level4');
		}
	}
}