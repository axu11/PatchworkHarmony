var Level5 = function(game) {};
Level5.prototype = {
	init: function(bgmOn, numPlatforms, reloadOnGround) {
		this.numPlatforms = numPlatforms;
		this.reloadOnGround = reloadOnGround;
		self = this;
		this.level = 5;
		this.bgmOn = bgmOn;
		inElevator = false;
		this.cutscenePlaying = false
		this.levelScale = 1.0;
		this.timer = 0;
		this.lockDown = false;
		this.playerCanMove = true;
		this.canCreate = true;
		if(wallShifted){
			this.keySolved = true;
		}
		else{
			this.keySolved = false;
		}
		this.playedCutscene6 = false;
		this.lockAudioPlayed = false;
		this.platformAdded  = false;
	},
	create: function() {
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for top floor of the library level, set bounds to image resolution (1600 x 600)
		this.bg0 = game.add.image(0, 0, 'lvl3-bg', 'bg5');   // Background 5 (elevator bottom floor)
		this.bg1 = game.add.image(800, 0, 'lvl3-bg', 'bg9'); // Background 9 (third gear and platform keys)
		this.bg2 = game.add.image(0, -600, 'lvl3-bg', 'bg4'); // Background 4 (third gear and platform keys)
		game.world.setBounds(0, -600, 1600, this.bg1.height + 600);

		// Create bgm for game, looped and played
		if(this.bgmOn == false) {
			this.bgm = game.add.audio('lvl3', 0.25, true);
			this.bgm.play();
			this.bgmOn = true;
		}
		// Create sound effects for when a music block platform is created
		this.platform1audio = game.add.audio('platform1audio');
		this.platform2audio = game.add.audio('platform2audio');
		this.platform3audio = game.add.audio('platform3audio');
		this.platform4audio = game.add.audio('platform4audio');
	
		// Creates sound effect for gear collection
		this.gearAudio = game.add.audio('collect-gear', 0.25, false);	

		// Creates sound effect for music block locking into place
		this.lockAudio = game.add.audio('locking', 1, false);

		if(!wallShifted){
			this.key1 = game.add.sprite(1125, 340, 'assets', 'music-block');
			this.key1.anchor.set(0.5);
			this.key1.scale.set(0.33 * this.levelScale);
			this.key1.alpha = 0.5;
			this.key1Lock = false;
			this.key1.alpha = 0;

			this.key2 = game.add.sprite(1250, 450, 'assets', 'music-block');
			this.key2.anchor.set(0.5);
			this.key2.scale.set(0.33 * this.levelScale);
			this.key2.alpha = 0.5;
			this.key2Lock = false;
			this.key2.alpha = 0;

			this.key3 = game.add.sprite(1000, 450, 'assets', 'music-block');
			this.key3.anchor.set(0.5);
			this.key3.scale.set(0.33 * this.levelScale);
			this.key3.alpha = 0.5;
			this.key3Lock = false;
			this.key3.alpha = 0;

			this.keyLock = game.add.sprite(800, -1050, 'lvl3', 'bookshelf1');
			this.keyLock.scale.set(1);
			this.keyLock.anchor.setTo(0);
			game.physics.arcade.enable(this.keyLock);
			this.keyLock.body.immovable = true;	

		}
		
		/***** GROUPS AND INVISIBLE BOUNDARIES *****/
		// Create elevators group
		this.elevators = game.add.group();
		this.elevators.enableBody = true;

		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		//Create createdPlatforms group 
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		// Create invisible ground platform for player to stand on, extends both four bgs
		this.ground = platforms.create(0, 550, 'atlas', 'sky'); 
		this.ground.scale.setTo(12.5, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.visible = false;

		// pedestal
		this.pedestal = platforms.create(1360, 420, 'atlas', 'sky');
		this.pedestal.scale.setTo(1, 1);
		game.physics.arcade.enable(this.pedestal);
		this.pedestal.body.immovable = true;
		this.pedestal.alpha = 0;

		// Create invisible ceiling platform for player to hit their little heads on, extends both bgs
		this.ceiling = platforms.create(0, 0, 'atlas', 'sky'); 
		this.ceiling.scale.setTo(12.5, 0.4);
		game.physics.arcade.enable(this.ceiling);
		this.ceiling.body.immovable = true;
		this.ceiling.visible = false;

		/***** ELEVATOR ROOM 2 (BG5) *****/
		// Creates an elevator that brings player up to top floor, starts open and powered 
		this.elevator = this.elevators.create(310, 330, 'lvl3', 'elevator3'); 
		this.elevator.scale.setTo(0.5);
		game.physics.arcade.enable(this.elevator);
		this.elevator.body.immovable = true;
		this.elevator.body.checkCollision.up = false;
	    this.elevator.body.checkCollision.down = false;
	    this.elevator.body.checkCollision.left = false;
	    this.elevator.body.checkCollision.right = false;

	    // Creates an invisible leftmost wall 
		this.leftWall = platforms.create(0, 0, 'lvl3', 'bookshelf1'); 
		this.leftWall.scale.setTo(0.5, 1.5);
		game.physics.arcade.enable(this.leftWall);
		this.leftWall.body.immovable = true;
		this.leftWall.alpha = 0;

		// Creates the right bookshelf that goes up last gear is obtained 
		this.shiftingWall2 = platforms.create(700, -550, 'lvl3', 'bookshelf2'); 
		this.shiftingWall2.scale.setTo(1, 1);
		game.physics.arcade.enable(this.shiftingWall2);
		this.shiftingWall2.body.immovable = true;	

		// Creates a visible platform for the elevator to rest on
		this.elevatorPlatform = platforms.create(255, -65, 'assets', 'shelf-platform');
		this.elevatorPlatform.scale.setTo(0.74, 0.50);
		game.physics.arcade.enable(this.elevatorPlatform);
		this.elevatorPlatform.body.immovable = true;

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

		// Creates a collectible "gear" that will enable player to unlock an ability
		if(!wallShifted){
			this.gear = game.add.sprite(1420, 370, 'assets', 'gear'); 
			game.physics.arcade.enable(this.gear);
			this.gear.body.immovable = true;
			this.gear.scale.setTo(0.75);
			this.gear.anchor.set(0.5);	
		}

		/***** PLAYER SPRITE *****/ 
		//this.players = game.add.group();
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 415, 485, this.levelScale); // -800
		this.player.enableBody = true;
		game.add.existing(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets','box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.15 * this.levelScale);
		this.box.body.collideWorldBounds = false;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = true; // Held from last level

		this.libraryCutscene = game.add.image(800, 0, 'cutscene6');
		this.libraryCutscene.alpha = 0;

		this.spacebar = game.add.sprite(325, 270, 'spacebar', 'spacebar1');
		this.spacebar.scale.setTo(0.33);
		this.spacebar.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 'spacebar', 1, 4), 4, true);
		this.spacebar.animations.play('spacebarAni');
		this.spacebar.alpha = 0;

		this.pauseMenuButton = game.add.button(750, 50, 'assets', this.openMenu, this, 'gear', 'gear', 'gear', 'gear');
		this.pauseMenuButton.anchor.set(0.5);
		this.pauseMenuButton.alpha = 1;
		this.pauseMenuButton.fixedToCamera = true;
		this.pauseMenuOpen = false;

		this.menuBg = game.add.sprite(400, 300, 'atlas', 'sky');
		this.menuBg.anchor.set(0.5);
		this.menuBg.scale.setTo(5, 3.5);
		this.menuBg.alpha = 0;
		this.menuBg.fixedToCamera = true;

		this.resumeButton = game.add.button(300, 350, 'assets', this.closeMenu, this, 'gear', 'gear', 'gear', 'gear');
		this.resumeButton.anchor.set(0.5);
		this.resumeButton.alpha = 0;
		this.resumeButton.fixedToCamera = true;

		this.mainMenuButton = game.add.button(300, 450, 'assets', this.goToMainMenu, this, 'gear', 'gear', 'gear', 'gear');
		this.mainMenuButton.anchor.set(0.5);
		this.mainMenuButton.alpha = 0;
		this.mainMenuButton.fixedToCamera = true;

		this.restartLevelButton = game.add.button(500, 350, 'assets', this.restartLevel, this, 'gear', 'gear', 'gear', 'gear');
		this.restartLevelButton.anchor.set(0.5);
		this.restartLevelButton.alpha = 0;
		this.restartLevelButton.fixedToCamera = true;

		this.skipLevelButton = game.add.button(500, 450, 'assets', this.skipLevel, this, 'gear', 'gear', 'gear', 'gear');
		this.skipLevelButton.anchor.set(0.5);
		this.skipLevelButton.alpha = 0;
		this.skipLevelButton.fixedToCamera = true;

		this.pauseMenu = new PauseMenu(game);
	},
	update: function() {

		if(!this.cutscenePlaying){
			this.checkCamBounds();
		}
		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		this.hitKeyLock = game.physics.arcade.collide(this.player, this.keyLock); // player vs keyLock
		this.boxHitKeyLock = game.physics.arcade.collide(this.box, this.keyLock); // box vs keyLock
		if(!hasThirdGear){
			game.physics.arcade.overlap(this.player, this.gear, this.collectLastGear, null, this);
		}
		game.physics.arcade.overlap(this.player, this.elevator, this.activateElevatorUp, null, this);

		if(game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()){
			elevatorActivated = true;
			// this.cutscenePlaying = true;
			// this.keySolved = true;
			//wallShifted = true;
		}

		if(game.input.keyboard.addKey(Phaser.KeyCode.W).justPressed()){
			reactivateCamera();
		}

		if(inElevator){
			this.spacebar.destroy();
		}

		if(!inElevator){
			if(this.player.overlap(this.elevators) && !inElevator && elevatorActivated){
		    	this.spacebar.alpha = 1;
		    }
		    else{
		    	this.spacebar.alpha = 0;
		    }

		}

		if(!this.playedCutscene6){
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.libraryCutscene.alpha >= 1) {
				this.libraryCutscene.destroy();
				game.time.events.add(Phaser.Timer.SECOND * 1, this.allowCreate, this);
				this.cutscenePlaying = false;
				this.playedCutscene6 = true;
			}

			if(this.libraryCutscene.alpha < 1 && hasThirdGear){
				this.libraryCutscene.alpha += 0.02;
				this.canCreate = false;
			}
		}
		
		if(!this.lockDown && this.player.x > 1200 && !wallShifted) {
			if(this.keyLock.y < 50) {
				this.cutscenePlaying = true;
				this.keyLock.y += 10;
			}
			else {
				this.lockDown = true;
				this.cutscenePlaying = false;
			}
		}

		if(this.lockDown){
			if(this.key1.alpha < 0.5){
				this.key1.alpha += 0.01;
				this.key2.alpha += 0.01;
				this.key3.alpha += 0.01;
			}
		}

		if(this.key1Lock && this.key2Lock && this.key3Lock && this.lockDown) {
			this.keySolved = true;
			if(this.keyLock.y > -1000) 
				this.keyLock.y -= 10;
		}

		if(this.keySolved && !wallShifted){
			if(!this.lockAudioPlayed){
				this.lockAudio.play();
				this.lockAudioPlayed = true;
			}
			this.cutscenePlaying = true;
			this.savePlayerX = this.player.x;
			this.savePlayerY = this.player.y;
			if(game.camera.x > 0){
				game.camera.x -= 16;
			}
			if(game.camera.x == 0 && game.camera.y > -600){
				game.camera.y -= 12;
				if(game.camera.y == -600) {
					wallShifted = true;
					game.time.events.add(Phaser.Timer.SECOND * 0.5, this.shiftWall, this);
				}
			}
		}
		
		/***** BOX STUFF *****/
		if(!inElevator){
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

				// Spawn platform directly under by pressing SPACEBAR
				if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.numPlatforms > 0 && !this.cutscenePlaying && this.canCreate) {
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

				// When picked up from left of box...
				if(game.input.keyboard.addKey(this.player.facing == 'RIGHT' && Phaser.KeyCode.SHIFT).justPressed() && this.hitPlatform && Math.abs((this.player.x + this.player.width/2) - (this.box.x - this.box.width/2)) <= 5) {
					this.attached = true;
				}
				// When picked up from right of box... 
				if(game.input.keyboard.addKey(this.player.facing == 'LEFT' && Phaser.KeyCode.SHIFT).justPressed() && this.hitPlatform && Math.abs((this.player.x - this.player.width/2) - (this.box.x + this.box.width/2)) <= 5) {
					this.attached = true;
				}
			}
		}

		// this.numPlatforms doesn't refresh until the player hits the ground
		if(!inElevator){
			if(this.reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform)) {
				this.numPlatforms++;
				this.reloadOnGround--;	
			}
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

		// If inElevator, timer increases, after hitting 160, go back up to the top floor
		if(inElevator){
			this.timer++;
			if(this.timer >= 160){
				this.bgm.destroy();
				game.state.start('Level4', true, false, false, this.numPlatforms, this.reloadOnGround);
			}
		}
		
		// Animate Gear
		this.gear.angle += 1;
	},

	render: function() {
		// game.debug.body(this.pedestal);
		// game.debug.body(this.player);
		// game.debug.body(this.box);
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.rectangle({x:game.camera.bounds.x, y:game.camera.bounds.y, width:game.camera.bounds.width, height:game.camera.bounds.height});
	},

	checkCamBounds: function() {
		// some funky, funky logic to check camera bounds for player movement
		if(this.player.x > game.width + game.camera.x && !this.player.body.blocked.right && this.player.facing === "RIGHT") {
			// move camera, then player
			game.camera.x += game.width;
			this.player.x = game.camera.x + Math.abs(this.player.width/2);	
		} 
		else if(this.player.x < game.camera.x && !this.player.body.blocked.left && this.player.facing === "LEFT") {
		 	// move camera, then player
		 	game.camera.x -= game.width;
		 	this.player.x = game.camera.x + game.width - Math.abs(this.player.width/2);	
		} 
		// else if(this.player.y + Math.abs(this.player.height/2) > game.height + game.camera.y && !this.player.body.blocked.down /*&& this.player.facing === "DOWN"*/) {
		// 	// move camera, then player
		// 	game.camera.y += game.height;
		// 	this.player.y = game.camera.y + Math.abs(this.player.height/2);	
		// } else if(this.player.y - Math.abs(this.player.height/2) < game.camera.y && !this.player.body.blocked.up /*&& this.player.facing === "UP"*/) {
		// 	// move camera, then player
		// 	game.camera.y -= game.height;
		// 	this.player.y = game.camera.y + game.height - Math.abs(this.player.height/2);	
		// }
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

	lockSound: function(){
		this.lockAudio.play();
	},

	// Function for activating the elevator to go up
	activateElevatorUp: function(Patches, elevator){
		if(!inElevator){
			// When spacebar pressed and player is standing
			if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.player.body.touching.down){
			
				// Reset player x and y values to be inside elevator, set inElevator to true cuz you're literally in the elevator
				this.player.x = 415;
			    this.player.y = 485;	
	   			inElevator = true;
			    
			    // KILL THE PLAYER, BOX AND THE CURRENT ELEVATOR SPRITE AHHH
				this.player.destroy();
				this.box.destroy();
				this.elevators.removeAll(true);
				this.spacebar.destroy();

				// Creates a new elevator sprite with its doors closed, but active
				this.elevator = this.elevators.create(310, 330, 'lvl3', 'elevator2'); 
				this.elevator.scale.setTo(0.5);

				// Elevator zooooooooooooooms up
				this.elevator.body.velocity.y = -75;

				// Fade out effect, 4000 ms
				if(inElevator){
					game.camera.fade(0x000000, 4000);
				}
			}
		}
	},

	// Function for collecting the last gear, specific to this level
	collectLastGear: function(){
		if(!this.platformAdded) {
			this.numPlatforms++;			// increase this.numPlatforms by one
			this.platformAdded = true;
		}
		hasThirdGear = true;				// doesn't have to be a global because used in nested loop within "!playedCutscene6"
		this.gearAudio.play();				// play gear audio
		this.gear.destroy();				// destroy the gear
		this.cutscenePlaying = true;		// cutscene plays on gear collect, therefore no movement is allowed
		game.camera.flash(0xffffff, 1000);  // flash effect, duration 1000ms
	},

	// Function for allowing user to create music note blocks, used to pause music note creation during cutscenes via delay
	allowCreate: function(){
		this.canCreate = true;
	},

	// Function for shifting the wall blocking the way to the door on top floor
	shiftWall: function(){
		this.shiftingWall2.body.velocity.y = -150							// wow it flies up
		// this.key1.alpha == 0;
		// this.key2.alpha == 0;
		// this.key3.alpha == 0;
		game.camera.fade(0x000000, 4000);									// fade effect, duration 4000ms
		game.time.events.add(Phaser.Timer.SECOND * 4, this.cameraReset, this);	// at the same time, after 4 seconds, reset the camera
	},

	// Function for resetting the camera (just a fade, not a pan like top floor)
	cameraReset: function(){
		game.camera.resetFX();	// kill the fade
		this.player.x = 1200;	// reset player x (a little bugged but w/e)
		this.player.y = 750;	// reset player y (a little bugged but w/e)
		game.camera.x = 800;	// reset camera x
		game.camera.y = 0;		// reset camera y
		game.time.events.add(Phaser.Timer.SECOND * 1.0, this.stopCutscene, this);	// after a second, enable movement
	},

	// Function for disabling cutscenePlaying, which was preventing movement
	stopCutscene: function(){
		this.cutscenePlaying = false;
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
		if(hasThirdGear)
			game.state.start('Level5', true, false, this.bgmOn, 3, 0);
		else
			game.state.start('Level5', true, false, this.bgmOn, 2, 0);
	},

	skipLevel: function() {
		this.bgm.destroy();
		game.state.start('Level4', true, false, false, 3, 0);
	}
}