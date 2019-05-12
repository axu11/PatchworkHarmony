var MainMenu = function(game) {};
MainMenu.prototype = {
	init: function() {
		// initialize score to 0
		this.score = 0;
	},
	
	create: function() {
		game.stage.backgroundColor = "#facade";
		instructions = game.add.text(100,200, 'PATCHWORK HARMONY', { fontSize: '48px', fill: '#000' });
		instructions = game.add.text(100,270, 'You are a toy bunny! Reunite the magic music box with its owner!', { fontSize: '16px', fill: '#000' });
		instructions = game.add.text(100,300, 'Press SPACEBAR to play!', { fontSize: '16px', fill: '#000' });
		instructions = game.add.text(100,330, 'Use the arrow keys to move!', { fontSize: '16px', fill: '#000' });
	},
	update: function() {
		// go to next state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}
	}
}