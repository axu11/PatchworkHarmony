// GameOver state completes loop by returning back to MainMenu
var GameOver = function(game) {};
GameOver.prototype = {

	create: function() {
		// Display game over messages and thanks player
		game.world.setBounds(0, 0, 800, 600);
		this.gameOverMessage = game.add.text(game.world.centerX, 200, "GAME OVER", style1);
		this.gameOverMessage.anchor.set(0.5);
		this.thankYouMessage = game.add.text(game.world.centerX, 270, "Thank you so much for demoing our game!", style1);
		this.thankYouMessage.anchor.set(0.5);
		this.resetMessage = game.add.text(game.world.centerX, 340, "Press SPACEBAR to restart", style1);
		this.resetMessage.anchor.set(0.5);
	},

	update: function() {
		// Go back to MainMenu state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('MainMenu');
		}
	},
	
	render: function() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.rectangle({x:game.camera.bounds.x, y:game.camera.bounds.y, width:game.camera.bounds.width, height:game.camera.bounds.height});
	}

}

