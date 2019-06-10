// Rooftop level state, second half (crane)
var Level3 = function(game) {};
Level3.prototype = {

	init: function(bgmOn, numPlatforms, reloadOnGround) {
		this.reloadOnGround = reloadOnGround;
		self = this;

		this.level = 3;						// current level is 1
		this.levelScale = 0.6;				// levelScale that affects the sizing of assets in prefabs
		this.numPlatforms = numPlatforms;	// current platforms set to maxPlatforms
		this.bgmOn = bgmOn;

		this.carryingPlatform = false;		// used in Platform prefab to check if the music block is holding a platform

		this.cutscenePlaying = false;		// var for whether or not there is a cutscene playing, essentially pauses game state
		this.pauseMenuOpen = false;
	},

	create: function() {
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for the scene
		this.bg = game.add.image(0, 0, 'bg3');

		// Create bgm for game, looped and played
		if(this.bgmOn == false) {
			this.bgm = game.add.audio('lvl2', 0.25, true);
			this.bgm.play();
			this.bgmOn = true;
		}

		// Create sound effects for when a music block platform is created
		this.platform1audio = game.add.audio('platform1audio');
		this.platform2audio = game.add.audio('platform2audio');
		this.platform3audio = game.add.audio('platform3audio');
		this.platform4audio = game.add.audio('platform4audio');

		// Create number circle at top left of screen to indicate platforms remaining
		this.numberPosition = 16;
		this.number0 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number0');
		this.number0.scale.set(0.5);
		this.number0.fixedToCamera = true;
		this.number1 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number1');
		this.number1.scale.set(0);
		this.number1.fixedToCamera = true;
		this.number2 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number2');
		this.number2.scale.set(0);
		this.number2.fixedToCamera = true;
		this.number3 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number3');
		this.number3.scale.set(0);
		this.number3.fixedToCamera = true;
		this.number4 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number4');
		this.number4.scale.set(0);
		this.number4.fixedToCamera = true;
		
		/***** PLATFORMS *****/
		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		// Create createdPlatforms group
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		// Dropping platform from crane
		this.droppedPlatform = platforms.create(185, 245, 'crane-platform'); 
		this.droppedPlatform.scale.setTo(1.5, 1);
		game.physics.arcade.enable(this.droppedPlatform);
		this.droppedPlatform.body.setSize(260, 20, 0, 75);
		this.droppedPlatform.body.immovable = true;
		this.droppingPlatform = true;

		// Invisible wall on the right prevents player from hitting edge
		this.rightWall = platforms.create(750, 0, 'atlas', 'sky');
		this.rightWall.scale.setTo(0.5, 10);
		game.physics.arcade.enable(this.rightWall);
		this.rightWall.body.immovable = true;
		this.rightWall.alpha = 0;
	
		// Rooftop on left side
		this.secondRooftop = platforms.create(-100, 490, 'lvl2', 'rooftop');
		this.secondRooftop.scale.setTo(0.6, 0.4);
		game.physics.arcade.enable(this.secondRooftop);
		this.secondRooftop.body.immovable = true;

		// Library building
		this.library = platforms.create(630, 100, 'library');
		this.library.scale.setTo(1, 1);
		game.physics.arcade.enable(this.library);
		this.library.body.setSize(200, 200, 0, 170);
		this.library.body.immovable = true;

		// Library ladder
		this.ladder = game.add.sprite(680, 180, 'atlas', 'sky');
		game.physics.arcade.enable(this.ladder);
		this.ladder.body.setSize(50, 120, 0, 0);
		this.ladder.body.immovable = true;
		this.ladder.visible = false;

		/***** PLAYER SPRITE *****/ 
		this.players = game.add.group();
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 50, 430, this.levelScale);
		this.player.enableBody = true;
		this.players.add(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets','box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.2 * this.levelScale);
		this.box.body.collideWorldBounds = false;
		this.box.body.gravity.y = 300; 
		this.box.body.drag = 0.5;
		this.attached = true; 

		// Down arrow indicator for exiting through window
		this.downArrow = game.add.sprite(670, 130, 'instructions', 'down1');
		this.downArrow.scale.setTo(0.33);
		this.downArrow.animations.add('arrowAni', Phaser.Animation.generateFrameNames('down', 1, 4, '', 1), 4, true);
		this.downArrow.animations.play('arrowAni');
		this.downArrow.alpha = 0;

		this.pauseMenu = new PauseMenu(game);
	},
	update: function() {
		// game.debug.body(this.ladder);
		/***** CAMERA, TRANSITIONS, AND CUTSCENES *****/
   		// When player gets to the ladder, go to level 4 (library top floor)

		if(this.player.overlap(this.ladder) && game.input.keyboard.addKey(Phaser.KeyCode.DOWN).justPressed()){
			this.cutscenePlaying = true;
			game.camera.fade(0x000000, 3000);
			game.time.events.add(Phaser.Timer.SECOND * 3.0, this.transitionToLibrary, this);
		}

		// Down arrow shows when player approaches ladder
		if(this.player.overlap(this.ladder)){
	    	this.downArrow.alpha = 1;
	    }
	    else{
	    	this.downArrow.alpha = 0;
	    }

   		// Reset state when player falls
		if(this.player.y + this.player.height/2 >= this.world.height - 1) {			
			game.state.start('Level3', true, false, this.bgmOn, 2, 0);
		}

		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   								// player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); 				// player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         								// player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   								// box vs platforms
		this.carryDroppedPlatform = game.physics.arcade.collide(this.droppedPlatform, this.createdPlatforms);   // dropped vs created platforms
		
		// Code for the dropping crane platform
		if(this.carryDroppedPlatform)
			this.droppingPlatform = false;
		else 
			this.droppingPlatform = true;

		if(this.droppingPlatform) {
			this.droppedPlatform.y += 4;
			if(this.droppedPlatform.y > 900)
				this.droppedPlatform.y = 245;
		}



		/***** BOX STUFF *****/
		this.box.body.velocity.x = 0; // Box won't glide when pushed by player

		// When holding the box...
		if(this.attached) {
			this.box.body.checkCollision.none = true;

			// Box moves where player is facing
			if(this.player.facing == "RIGHT") 
				this.box.x = this.player.x + this.player.width/2 + this.box.width/2 - (37*this.levelScale);
			else 
				this.box.x = this.player.x - this.player.width/2 - this.box.width/2 + (30*this.levelScale);

			this.box.y = this.player.y + (17*this.levelScale);	 // the box is off the ground and with the player
			this.box.body.gravity.y = 0; // box doesn't fall when you're holding it

			// Spawn platform directly under by pressing SPACEBAR
			if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.numPlatforms > 0) {
				// Kills all current sounds set to play before playing the music note sounds in order
				game.time.events.removeAll();
				game.time.events.add(Phaser.Timer.SECOND * 0.0, this.platformSound1, this);
				game.time.events.add(Phaser.Timer.SECOND * 0.5, this.platformSound2, this);
				game.time.events.add(Phaser.Timer.SECOND * 1.0, this.platformSound3, this);
				game.time.events.add(Phaser.Timer.SECOND * 1.5, this.platformSound4, this);

				this.createdPlatform = new Platform(game, 'assets', 'music-block', this.player.x, this.player.y + this.player.height/2 + 30 * this.levelScale, this.levelScale);
				this.createdPlatforms.add(this.createdPlatform); 
				game.physics.arcade.enable(this.createdPlatform);
				this.createdPlatform.body.checkCollision.down = false;
				this.createdPlatform.body.checkCollision.left = false;
				this.createdPlatform.body.checkCollision.right = false;
				this.createdPlatform.body.immovable = true;	
				this.numPlatforms--;
			}

			// Drop the box by pressing SHIFT
			if(game.input.keyboard.addKey(Phaser.KeyCode.SHIFT).justPressed()) {
				this.attached = false;
				this.box.body.checkCollision.none = false;
			}
		}

		// When not holding the box...
		else {
			this.box.body.gravity.y = 300;	// Box has gravity, will fall

			// Pick up box
			if(game.input.keyboard.addKey(this.player.facing == 'RIGHT' && Phaser.KeyCode.SHIFT).justPressed() && this.hitPlatform && Math.abs((this.player.x + this.player.width/2) - (this.box.x - this.box.width/2)) <= 5) 
				this.attached = true;
			else if(game.input.keyboard.addKey(this.player.facing == 'LEFT' && Phaser.KeyCode.SHIFT).justPressed() && this.hitPlatform && Math.abs((this.player.x - this.player.width/2) - (this.box.x + this.box.width/2)) <= 5) 
				this.attached = true;
		}

		// this.numPlatforms doesn't refresh until the player hits the ground
		if(this.reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform)) {
			this.numPlatforms++;
			this.reloadOnGround--;	
		}

		// Top-left number updates with this.numPlatforms
		if(this.numPlatforms == 0) {
			this.number0.scale.set(0.5);
			this.number1.scale.set(0);
			this.number2.scale.set(0);
			this.number3.scale.set(0);
			this.number4.scale.set(0);
		}
		else if(this.numPlatforms == 1) {
			this.number0.scale.set(0);
			this.number1.scale.set(0.5);
			this.number2.scale.set(0);
			this.number3.scale.set(0);
			this.number4.scale.set(0);
		}
		else if(this.numPlatforms == 2) {
			this.number0.scale.set(0);
			this.number1.scale.set(0);
			this.number2.scale.set(0.5);
			this.number3.scale.set(0);
			this.number4.scale.set(0);
		}
		else if(this.numPlatforms == 3) {
			this.number0.scale.set(0);
			this.number1.scale.set(0);
			this.number2.scale.set(0);
			this.number3.scale.set(0.5);
			this.number4.scale.set(0);
		}
		else {
			this.number0.scale.set(0);
			this.number1.scale.set(0);
			this.number2.scale.set(0);
			this.number3.scale.set(0);
			this.number4.scale.set(0.5);
		}
	},

	// Functions for playing the platform audio sounds
	platformSound1: function(){
		this.platform1audio.play();
	},

	platformSound2: function(){
		this.platform2audio.play();
	},

	platformSound3: function(){
		this.platform3audio.play();
	},

	platformSound4: function(){
		this.platform4audio.play();
	},

	// Function called to transition to next level and kill bgm
	transitionToLibrary: function(){
		game.state.start('Level4', true, false, false, 2, 0);
		this.bgm.destroy();
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
		game.state.start('Level3', true, false, this.bgmOn, 2, 0);
	},

	skipLevel: function() {
		this.bgm.destroy();
		game.state.start('Level4', true, false, false, 2, 0);
	}
}