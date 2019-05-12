var GameOver = function(game) {};
GameOver.prototype = {

	create: function() {
		// display game over messages
		this.gameOverMessage = game.add.text(game.world.centerX, game.world.centerY - 48, "GAME OVER", style1);
		this.gameOverMessage.anchor.set(0.5);
		this.resetMessage = game.add.text(game.world.centerX, game.world.centerY + 36, "Press SPACEBAR to restart", style2);
		this.resetMessage.anchor.set(0.5);
	},

	update: function() {
		// go back to play state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('MainMenu');
		}
	}

}

