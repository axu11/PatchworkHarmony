// MainMenu state used to display the game premise and title
var Intro = function(game) {};
Intro.prototype = {
	init: function() {
		this.currentScene = 1;
		this.delay = 0;
	},
	create: function() {
		// Put up first cutscene
		this.cutscene1 = game.add.image(0, 0, 'cutscene1');
		this.cutscene1.alpha = 0;

		// Play intro music
		this.bgm = game.add.audio('intro', 0.5, true);
		this.bgm.play();

		// Adds a fade on complete event, goes to tutorial
		//game.camera.onFadeComplete.add(transitionToTutorial, this);
	},

	update: function() {
		// Delay before spacebar can be pressed
		this.delay++;
        if(this.cutscene1.alpha < 1){
        	this.cutscene1.alpha += 0.01;
        }

		// Proceed to second cutscene
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 1) {
			game.add.image(0, 0, 'cutscene2');
			this.delay = 0;
			this.currentScene++;
		}

		// Proceed to third cutscene
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 2 && this.delay > 80) {
			game.add.image(0, 0, 'cutscene3');
			this.delay = 0;
			this.currentScene++;
		}

		// Fade out
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 3 && this.delay > 80) {
			game.camera.fade(0x000000, 4000);
			game.time.events.add(Phaser.Timer.SECOND * 4, transitionToTutorial, this);
		}
	}
}

// When fade completes, move to tutorial
function transitionToTutorial(){
	this.bgm.destroy();
	game.state.start('Play', true, false, 0);
}