// MainMenu state used to display the game premise and title
var Intro = function(game) {};
Intro.prototype = {
	init: function() {
		this.currentScene = 1;
		this.delay = 0;
	},
	create: function() {
		// Temp background and placeholder text instructions
		game.add.image(0, 0, 'cutscene1');
		this.bgm = game.add.audio('intro', 0.5, true);
		this.bgm.play();

		game.camera.onFadeComplete.add(transitionToTutorial, this);
	},

	update: function() {
		// Go to Play state once SPACEBAR pressed
		this.delay++;
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 1) {
			game.add.image(0, 0, 'cutscene2');
			this.delay = 0;
			this.currentScene++;
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 2 && this.delay > 120) {
			game.add.image(0, 0, 'cutscene3');
			this.delay = 0;
			this.currentScene++;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 3 && this.delay > 120) {
			game.camera.fade(0x000000, 4000);
		}
	}
}

function transitionToTutorial(){
	this.bgm.destroy();
	game.state.start('Play');
}