// MainMenu state used to display the game premise and title
var Intro = function(game) {};
Intro.prototype = {
	init: function() {
		this.currentScene = 1;
		this.delay = 0;
	},
	create: function() {
		// Put up first cutscene
		this.cutscene3 = game.add.image(0, 0, 'cutscene3');
		this.cutscene3.alpha = 0;

		// Put up first cutscene
		this.cutscene2 = game.add.image(0, 0, 'cutscene2');
		this.cutscene2.alpha = 0;

		// Put up first cutscene
		this.cutscene1 = game.add.image(0, 0, 'cutscene1');
		this.cutscene1.alpha = 0;

		// Play intro music
		this.bgm = game.add.audio('intro', 0.5, true);
		this.bgm.play();

		this.spacebar = game.add.sprite(650, 550, 'spacebar', 'spacebar1');
		this.spacebar.scale.setTo(0.33);
		this.spacebar.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 'spacebar', 1, 4), 10, true);
		this.spacebar.animations.play('spacebarAni');
		this.spacebar.alpha = 0;
		// Adds a fade on complete event, goes to tutorial
		//game.camera.onFadeComplete.add(transitionToTutorial, this);
	},

	update: function() {
		// Delay before spacebar can be pressed
		this.delay++;
		// console.log(this.delay);
		// console.log('currentScene: ' + this.currentScene);

		// Fade in first cutscene
        if(this.cutscene1.alpha < 1){
        	this.cutscene1.alpha += 0.01;
        	//this.spacebar.alpha += 0.01;
        }

        if(this.delay > 60 && this.currentScene == 1){
			this.spacebar.alpha = 1;
		}

		// Proceed to second cutscene
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 1) {
			this.delay = 0;
			this.currentScene++;
			this.cutscene1.destroy();
			this.spacebar.alpha = 0;
			this.cutscene2.alpha = 1;
		}

		if(this.delay > 80 && this.currentScene == 2){
			this.spacebar.alpha = 1;
		}

		// Proceed to third cutscene
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 2 && this.delay > 80) {
			this.delay = 0;
			this.currentScene++;
			this.cutscene2.destroy();
			this.spacebar.alpha = 0;
			this.cutscene3.alpha = 1;
		}

		if(this.delay > 80 && this.currentScene == 3){
			this.spacebar.alpha = 1;
		}

		// Fade out
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.currentScene == 3 && this.delay > 80) {
			game.camera.fade(0x000000, 4000);
			game.time.events.add(Phaser.Timer.SECOND * 4, transitionToTutorial, this);
			this.spacebar.alpha = 0;
		}
	}
}

// When fade completes, move to tutorial
function transitionToTutorial(){
	this.bgm.destroy();
	game.state.start('Play', true, false, 0);
}