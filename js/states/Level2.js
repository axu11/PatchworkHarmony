// Rooftop level state, first part (clocktower)
var Level2 = function(game) {};
Level2.prototype = {

	init: function(bgmOn, maxPlatforms) {
		maxPlatforms = 1;	
		reloadOnGround = 0;
		self = this;

		this.level = 2;						// current level is 2
		this.levelScale = 0.45;				// levelScale that affects the sizing of assets in prefabs
		this.numPlatforms = maxPlatforms;	// current platforms set to maxPlatforms
		this.bgmOn = bgmOn;
		
		this.cutscenePlaying = false;		// var for whether or not there is a cutscene playing, essentially pauses game state
		this.playedCutscene5 = false;		// determines whether or not the cutscene code in update is run	
		this.hasSecondGear = false;			// triggers a cutscene when this is true

		this.canCreate = true;				// set to false during cutscenes to prevent block creation

		this.timer = 0;						// timer for cutscenes, ticks up 
		this.TIMER_VALUE = 40;				// modify this here depending on how long the delay should be before spacebar can be pressed
	},

	create: function() {
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for both scenes, set bounds to image resolution (1600 x 600)
		this.bg0 = game.add.image(0, 0, 'bg2');
		this.bg1 = game.add.image(800, 0, 'bg3');
		game.world.setBounds(0, 0, this.bg0.width+800, this.bg0.height);

		// Create bgm for game, looped and played, continues on second screen
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

		// Create bounce sound
		this.jump = game.add.audio('trampoline', 0.1, false);

		// Creates gear sound
		this.gearAudio = game.add.audio('collect-gear', 0.25, false);	


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

		// Workshop
		this.workshop = platforms.create(0, 535, 'lvl2', 'exterior'); 
		this.workshop.scale.setTo(0.5, 0.25);
		game.physics.arcade.enable(this.workshop);
		this.workshop.body.immovable = true;

		// Billboard
		this.billboard = platforms.create(170, 430, 'lvl2', 'billboard');
		this.billboard.scale.setTo(0.25, 0.3);
		game.physics.arcade.enable(this.billboard);
		this.billboard.body.setSize(500, 350, 150, 65);
		this.billboard.body.immovable = true;

		// Building next to tower
		this.building = platforms.create(500, 490, 'lvl2', 'rooftop');
		this.building.scale.setTo(0.6, 0.4);
		game.physics.arcade.enable(this.building);
		this.building.body.immovable = true;

		// Ledge
		this.ledge = platforms.create(600, 350, 'assets', 'shelf-platform');
		this.ledge.scale.setTo(0.15, 0.3);
		game.physics.arcade.enable(this.ledge);
		this.ledge.body.immovable = true;

		// Big ass tower
		this.tower = platforms.create(630, 100, 'lvl2', 'clocktower');
		this.tower.scale.setTo(1, 1);
		game.physics.arcade.enable(this.tower);
		this.tower.body.setSize(170, 500, 0, 140);
		this.tower.body.immovable = true;

		// Trampoline
		this.trampoline = game.add.sprite(100, 400, 'lvl2', 'trampoline');
		this.trampoline.anchor.setTo(0.5, 1);
		this.trampoline.scale.setTo(0.3, 0.3);
		game.physics.arcade.enable(this.trampoline);
		this.trampoline.body.immovable = true;
		this.trampoline.body.checkCollision.down = false;
		this.trampoline.body.checkCollision.left = false;
		this.trampoline.body.checkCollision.right = false;
		this.trampolineStand = game.add.sprite(100, 395, 'assets', 'shelf-platform');
		this.trampolineStand.scale.set(0.33);
		this.trampolineStand.anchor.setTo(0.5, 0);

		// Creates the second collectible gear
		this.gear = game.add.sprite(100, 100, 'assets', 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.scale.setTo(0.5, 0.5);
		this.gear.anchor.set(0.5, 0.5);	

		/***** PLAYER SPRITE *****/ 
		this.players = game.add.group();
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 40, 500, this.levelScale);
		this.player.enableBody = true;
		this.players.add(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets','box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.2 * this.levelScale);
		this.box.body.collideWorldBounds = false;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = true; // Held from last level

		// The second gear cutscene
		this.rooftopCutscene = game.add.image(0, 0, 'cutscene5');
		this.rooftopCutscene.alpha = 0;

		// Spacebar indicator for gear cutscene
		this.spacebar = game.add.sprite(650, 550, 'instructions', 'spacebar1'); 
		this.spacebar.scale.setTo(0.33);
		this.spacebar.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 1, 3), 5, true);
		this.spacebar.animations.play('spacebarAni');
		this.spacebar.alpha = 0;
	},

	update: function(){
		//game.debug.body(this.billboard);
		//game.debug.body(this.tower);
		//game.debug.body(this.secondRooftop);
		//game.debug.body(this.library);

		/***** CAMERA, TRANSITIONS, AND CUTSCENES *****/
		this.checkCamBounds(); // Keep checking camera bounds

		// If the cutscene hasn't played yet
		if(!this.playedCutscene5){
			if(this.rooftopCutscene.alpha >= 1)
				this.timer++;

			// If the cutscene is showing and the second gear has been collected, show the scene, disable music block creation
			if(this.rooftopCutscene.alpha < 1 && this.hasSecondGear){
				this.rooftopCutscene.alpha += 0.02;
				this.canCreate = false;
			}

			// If this.timer passed the spacebar delay, show the spacebar
			if(this.timer >= this.TIMER_VALUE)
				this.spacebar.alpha = 1;

			// If the spacebar is showing and the player presses space, destroy both the cutscene and the spacebar, end cutscene
			if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed()) {
				this.rooftopCutscene.destroy();
				this.spacebar.destroy();
				this.cutscenePlaying = false;
				this.playedCutscene5 = true;
				game.time.events.add(Phaser.Timer.SECOND * 1, this.allowCreate, this);
			}
		}

		// Animate Gear
		this.gear.angle += 1;

		// Reset state when player falls
		if(this.player.y + this.player.height/2 >= this.world.height - 1) {
			game.state.start('Level2', true, false, this.bgmOn, maxPlatforms);
		}

		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		this.hitTrampoline = game.physics.arcade.collide(this.player, this.trampoline);
		game.physics.arcade.overlap(this.player, this.gear, this.collectSecondGear, null, this);
		
		// Trampoline bounce logic
		if((this.player.x + this.player.width/2 >= (this.trampoline.x - this.trampoline.width/2 - 2) && this.player.x - this.player.width/2 <= (this.trampoline.x + this.trampoline.width/2 + 2)) &&
			(((this.player.y + this.player.height/2) >= (this.trampoline.y - this.trampoline.height - 15)) && this.player.y + this.player.height/2 <= this.trampoline.y - this.trampoline.height + 1)) {
			this.player.body.bounce.y = 1;
			// Play bounce sound on bounce
			if(this.hitTrampoline && !this.cutscenePlaying){
				this.jump.play();
			}
		}
		else {
			this.player.body.bounce.y = 0;
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
			if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.numPlatforms > 0 && this.canCreate) {
				// Kills all current sounds set to play before playing the music note sounds in order
				game.time.events.removeAll();
				game.time.events.add(Phaser.Timer.SECOND * 0.0, platformSound1, this);
				game.time.events.add(Phaser.Timer.SECOND * 0.5, platformSound2, this);
				game.time.events.add(Phaser.Timer.SECOND * 1.0, platformSound3, this);
				game.time.events.add(Phaser.Timer.SECOND * 1.5, platformSound4, this);

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
			if(game.input.keyboard.addKey(Phaser.KeyCode.SHIFT).justPressed() && !this.cutscenePlaying) {
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

		// this.numPlatforms doesn't refresh until the player hits the ground or a trampoline
		if(reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform || this.hitTrampoline)) {
			this.numPlatforms++;
			reloadOnGround--;	
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

	checkCamBounds: function() {
		if(this.player.x + Math.abs(this.player.width/2) > game.width + game.camera.x && !this.player.body.blocked.right && this.player.facing === "RIGHT") {
			// Stop music and go to crane level
			this.bgm.stop();
			game.state.start('Level3', true, false, false, maxPlatforms);	
		} 
	},

	// Function for collecting "gears"
	collectSecondGear: function(Patches, gear){
		maxPlatforms = 2;
		this.numPlatforms++;
		this.cutscenePlaying = true;
		this.hasSecondGear = true;
		this.gearAudio.play();
		gear.kill();
		game.camera.flash(0xffffff, 1000);
	},

	// Function for allowing user to create music note blocks, used to pause music note creation during cutscenes via delay
	allowCreate: function(){
		this.canCreate = true;
	}
}