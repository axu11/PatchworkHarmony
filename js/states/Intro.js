// Intro state used to display the first couple narrative cutscenes to build the plot
var Intro = function(game) {};
Intro.prototype = {

	init: function() {
		this.currentScene = 1;	// number from 1 to 3, one for each cutscene

		this.timer = 0;			// timer for cutscenes, ticks up 
		this.TIMER_VALUE = 60;	// modify this here depending on how long the delay should be before spacebar can be pressed
	},

	create: function() {
		// Put up third cutscene, invisible
		this.cutscene3 = game.add.image(0, 0, 'cutscene3');
		this.cutscene3.alpha = 0;

		// Put up second cutscene, invisible
		this.cutscene2 = game.add.image(0, 0, 'cutscene2');
		this.cutscene2.alpha = 0;

		// Put up first cutscene, invisible
		this.cutscene1 = game.add.image(0, 0, 'cutscene1');
		this.cutscene1.alpha = 0;

		// Play intro music
		this.bgm = game.add.audio('intro', 0.25, true);        //********TEMP TO BE CHANGED*********
		this.bgm.play();

		// Spacebar indicators for all the cutscenes
		this.spacebar = game.add.sprite(650, 550, 'spacebar', 'spacebar1');
		this.spacebar.scale.setTo(0.33);
		this.spacebar.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 'spacebar', 1, 4), 10, true);
		this.spacebar.animations.play('spacebarAni');
		this.spacebar.alpha = 0;
	},

	update: function() {
		// Delay before spacebar can be pressed
		this.timer++;

		// Fade in first cutscene
        if(this.cutscene1.alpha < 1){
        	this.cutscene1.alpha += 0.01;
        }

        // If this.timer passed the spacebar delay, show the spacebar
		if(this.timer >= this.TIMER_VALUE)
			this.spacebar.alpha = 1;

		// Proceed to second cutscene
		if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentScene == 1) {
			this.cutscene1.destroy();
			this.spacebar.alpha = 0;
			this.cutscene2.alpha = 1;
			this.currentScene++;
			this.timer = 0;
		}

		// Proceed to third cutscene
		if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentScene == 2) {
			this.cutscene2.destroy();
			this.spacebar.alpha = 0;
			this.cutscene3.alpha = 1;
			this.currentScene++;
			this.timer = 0;			
		}

		// Fade out to tutorial
		if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentScene == 3) {
			game.camera.fade(0x000000, 4000);
			game.time.events.add(Phaser.Timer.SECOND * 4, transitionToTutorial, this);
			this.spacebar.destroy();
		}
	}
}

// When fade completes, move to tutorial
function transitionToTutorial(){
	this.bgm.destroy();
	game.state.start('Play', true, false, false, 0, 0);
}