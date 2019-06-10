var Level7 = function(game) {};
Level7.prototype = {

	init: function(bgmOn, numPlatforms, reloadOnGround) {
		this.numPlatforms = numPlatforms;
		this.reloadOnGround = reloadOnGround;
		this.bgmOn = bgmOn;
		this.cutscenePlaying = true;
		self = this;
	},

	create: function() {
		
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for top floor of the library level, set bounds to image resolution (1600 x 600)
		this.bg0 = game.add.image(0, 0, 'cutscene7');   		  	// Cutscene 7 (outside library)
		this.bg0.alpha = 0;
		this.bg1 = game.add.image(0, 0, 'cutscene8', 'scene1');		// Cutscene 8 (box open)
		this.bg1.alpha = 0;
		this.bg1.animations.add('cutscene8', Phaser.Animation.generateFrameNames('cutscene8', 'scene', 1, 3), 4, true);
		this.bg1.animations.play('cutscene8');
		game.world.setBounds(0, 0, 800, 800);
		
		// Create bgm for game, looped and played
		if(this.bgmOn == false) {
			this.bgm = game.add.audio('intro', 0.25, true);
			this.bgm.play();
			this.bgmOn = true;
		}

		// Sound effect for jumping
		this.hop = game.add.audio('jump', 0.25, false);;

		// Create platforms group
		this.platforms = game.add.group();
		this.platforms.enableBody = true;

		// Bench 
		this.bench = game.add.sprite(445, 560, 'atlas', 'sky'); 
		this.bench.scale.setTo(2, 0.25);
		game.physics.arcade.enable(this.bench);
		this.bench.body.immovable = true;
		this.bench.alpha = 0;
		this.bench.body.checkCollision.down = false;
		this.bench.body.checkCollision.left = false;
		this.bench.body.checkCollision.right = false;

		// Ground under the background
		this.ground = this.platforms.create(-64, 650, 'atlas', 'sky'); 
		this.ground.scale.setTo(13, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.visible = false;

		// Patches, but you can't actually move him
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 0, 550, 1); 
		this.player.enableBody = true;
		this.player.scale.setTo(0.5);
		game.add.existing(this.player);
		this.player.animations.add('moveRight', ['patchesAtlas2', 'right1', 'right2', 'right3'], 4, false);
		this.player.animations.add('idleRight', ['patchesAtlas2', 'right1'], 60, false);

		// Music box stripped down, can only move and not be used to make blocks
		this.box = game.add.sprite(350, 250, 'assets', 'box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.15 * this.levelScale);
		this.attached = true; // Held from last level

		this.pauseMenu = new PauseMenu(game);
	},

	update: function() {

		// Collisions
		this.hitPlatform = game.physics.arcade.collide(this.player, this.platforms);   	// player vs platforms
		this.hitBench = game.physics.arcade.collide(this.player, this.bench);			// player vs bench

		// If on top of the bench, stop animation and movement, fade to next scene
		if(this.hitBench && this.bg0.alpha == 1){
			this.player.body.velocity.x = 0;
			this.player.animations.stop('moveRight');
			this.player.animations.play('idleRight');
			game.camera.fade(0x000000, 2000);
			game.time.events.add(Phaser.Timer.SECOND * 2.0, this.transitionToCutscene8, this);
		}

		// If not touching the bench, animate moving right
		if(!this.hitBench && this.bg0.alpha == 1){
			this.player.animations.play('moveRight');
			this.player.body.velocity.x = 125;
		}

		// Fade in cutscene 7 if cutscene 8 is not showing
		if(this.bg0.alpha < 1 && this.bg1.alpha == 0)
			this.bg0.alpha += 0.01;

		// Play the hop sounds as patches jumps in the animation
		if(this.bg0.alpha > 1){
			game.time.events.add(Phaser.Timer.SECOND, this.playHop, this);
			game.time.events.add(Phaser.Timer.SECOND * 3.25, this.playHop, this);
			game.time.events.add(Phaser.Timer.SECOND * 5.1, this.playHop, this);
			this.bg0.alpha = 1;
		}

		// Box follows player
		this.box.x = this.player.x + this.player.width/2 + this.box.width/2 - 42;
		this.box.y = this.player.y + 17;
		this.box.body.gravity.y = 0;
		this.box.body.checkCollision.none = true;
	},

	// Function for playing the hop sounda and elevating player
	playHop: function() {
		this.hop.play();
		this.player.body.velocity.y = -550;
	},

	// Resets the fade to go to credits
	transitionToCutscene8: function() {
		game.camera.resetFX();
		this.player.alpha = 0;
		this.box.alpha = 0;
		this.bg1.alpha = 1;
		this.bg0.alpha = 0;
		game.camera.fade(0x000000, 4000);
		game.time.events.add(Phaser.Timer.SECOND * 6.0, this.transitionToCredits, this);
	},

	// Goes the credits
	transitionToCredits: function() {
		game.state.start('Credits', true, false, this.bgm);
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
		game.state.start('Credits', true, false, this.bgm);
	}	
}


	

	


	


