var Level7 = function(game) {};
Level7.prototype = {
	init: function(bgmOn, numPlatforms, reloadOnGround) {
		this.numPlatforms = numPlatforms;
		this.reloadOnGround = reloadOnGround;
		self = this;
		level = 5;
		this.bgmOn = bgmOn;
		cutscenePlaying = false;
		keySolved = true;
		wallShifted = true;
		this.levelScale = 1.0;
		this.timer = 0;
		this.playerCanMove = true;


	},
	create: function() {
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for top floor of the library level, set bounds to image resolution (1600 x 600)
		this.bg0 = game.add.image(0, 0, 'cutscene7');   // Background 5 (elevator bottom floor)
		game.world.setBounds(0, 0, 800, 600);
		
		//this.asdadasdnasdsadsa = game.add.text(game.world.centerX, game.world.centerY, 'WE ARE ON THE LAST LEVEL ASDJSADBSADKSA', textStyle);
		// Create bgm for game, looped and played
		if(this.bgmOn == false) {
			this.bgm = game.add.audio('lvl1', 0.25, true);
			this.bgm.play();
			this.bgmOn = true;
		}

		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		//Create createdPlatforms group 
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		
		this.player = game.add.sprite(415, 485, 'patchesAtlas2', 'right1'); // -800
		this.player.enableBody = true;
		this.player.scale.setTo(0.33);
		game.add.existing(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets', 'box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.15 * this.levelScale);
		this.attached = true; // Held from last level

		this.pauseMenu = new PauseMenu(game);
	},
	update: function() {
		//console.log(level);
		//console.log(inElevator);
		// console.log(game.camera.x);
		// console.log(game.camera.y);
		/***** BOX STUFF *****/

			this.box.body.velocity.x = 0; // Box won't glide when pushed by player

			// When holding the box...
			if(this.attached) {
				this.box.body.checkCollision.none = true;
				// Box moves where player is facing
				if(this.player.facing == "RIGHT") {
					this.box.x = this.player.x + this.player.width/2 + this.box.width/2 - (37*this.levelScale);
				}
				else {
					this.box.x = this.player.x - this.player.width/2 - this.box.width/2 + (30*this.levelScale);
				}
				this.box.y = this.player.y + (17*this.levelScale);	 // the box is off the ground and with the player
				this.box.body.gravity.y = 0; // box doesn't fall when you're holding it

				}
	
	},

	openMenu: function() {
		this.pauseMenuOpen = true;
	},

	closeMenu: function() {
		this.pauseMenuOpen = false;
	},

	goToMainMenu: function() {
		game.state.start('MainMenu');
	},

	restartLevel: function() {
		game.state.start('Level7', true, false, this.bgmOn, 3, 0);
	},

	skipLevel: function() {
		this.bgm.destroy();
		//start credits
	}	
}

