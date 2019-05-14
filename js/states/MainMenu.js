// MainMenu state used to display the game premise and title
var MainMenu = function(game) {};
MainMenu.prototype = {
	
	create: function() {
		// Temp background and placeholder text instructions
		game.stage.backgroundColor = "#facade";
		this.title = game.add.text(game.world.centerX, 200, 'PATCHWORK HARMONY', { fontSize: '48px', fill: '#000' });
		this.title.anchor.set(0.5);
		this.description = game.add.text(game.world.centerX, 270, 'You are a toy bunny! Reunite the magic music box with its owner!', { fontSize: '16px', fill: '#000' });
		this.description.anchor.set(0.5);
		this.startInstructions = game.add.text(game.world.centerX,300, 'Press SPACEBAR to play!', { fontSize: '16px', fill: '#000' });
		this.startInstructions.anchor.set(0.5);
	},

	update: function() {
		// Go to Play state once SPACEBAR pressed
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}
	}
}