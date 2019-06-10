var Credits = function(game) {};
Credits.prototype = {

	init: function(bgm) {
		this.fadeIn = 0;
		this.timer = 0;
		this.TIMER_VALUE = 80;
		this.bgm = bgm;
	},

	create: function() {
		this.bg0 = game.add.image(0, 0, 'cutscene9');
		this.bg0.alpha = 0;

		
		// Add developer title
		this.gameTitle = game.add.text(game.world.centerX, 700, 'Patchwork Harmony', textStyle);
		this.gameTitle.anchor.set(0.5);

		// Add start instructions
		this.devTitle = game.add.text(game.world.centerX, 800, 'A Grapple Studio Production', textStyle);
		this.devTitle.anchor.set(0.5);
		this.devTitle.fontSize = 20;

		// Add start instructions
		this.designer = game.add.text(350, 850, 'Lead Designer and Writer                Anfernee Lai', textStyle);
		this.designer.anchor.set(0.5);
		this.designer.fontSize = 20;

		// Add start instructions
		this.programmer = game.add.text(350, 900, '      Lead Programmer                Andrew Xu', textStyle);
		this.programmer.anchor.set(0.5);
		this.programmer.fontSize = 20;

		// Add start instructions
		this.artist = game.add.text(350, 950, '                    Lead Artist                Veenna San Felipe', textStyle);
		this.artist.anchor.set(0.5);
		this.artist.fontSize = 20;

		// Add start instructions
		this.sound = game.add.text(350, 1000, '    Lead Sound Designer                Michael Sim', textStyle);
		this.sound.anchor.set(0.5);
		this.sound.fontSize = 20;

		// Add start instructions
		this.end = game.add.text(game.world.centerX, 1100, 'Thank you', textStyle);
		this.end.anchor.set(0.5);
		this.end.fontSize = 20;

		this.spacebar = game.add.sprite(650, 550, 'spacebar', 'spacebar1');
		this.spacebar.scale.setTo(0.33);
		this.spacebar.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('instructions', 'spacebar', 1, 3), 4, true);
		this.spacebar.animations.play('spacebarAni');
		this.spacebar.alpha = 0;

		


	},

	update: function() {
		this.gameTitle.y--;
		this.devTitle.y--;
		this.designer.y--;
		this.programmer.y--;
		this.artist.y--;
		this.sound.y--;
		this.end.y--;
		if(this.end.y == 300){
			game.camera.fade(0x000000, 6000);
			game.time.events.add(Phaser.Timer.SECOND * 7, this.creditsScene, this);
		}
		if(this.bg0.alpha < 1){
			this.bg0.alpha += this.fadeIn;
		}

		if(this.bg0.alpha >= 1){
			this.timer++;

			// If this.timer passed the spacebar delay, show the spacebar
			if(this.timer >= this.TIMER_VALUE)
				this.spacebar.alpha = 1;

			// If spacebar showing and you press space, proceed to second instruction bubble
			if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed()){
				game.camera.fade(0x000000, 4000);
				game.time.events.add(Phaser.Timer.SECOND * 4, this.transitionToMainMenu, this);
				this.bgm.fadeOut(4000);
				this.spacebar.alpha = 0;
				this.timer = -200;
			}
		}
	},

	creditsScene: function () {
		this.fadeIn = 0.01;
		game.camera.resetFX();
	},

	transitionToMainMenu: function (){
		this.bgm.destroy();
		game.state.start('MainMenu');
	}
		
	
}




