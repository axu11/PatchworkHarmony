var Level5 = function(game) {};
Level5.prototype = {
	init: function() {
		numPlatforms = 2;
		reloadOnGround = 0;
		self = this;
		level = 5;
		inElevator = false;
		this.levelScale = 1.0;
		this.timer = 0;
	},
	create: function() {
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for top floor of the library level, set bounds to image resolution (1600 x 600)
		this.bg0 = game.add.image(0, 0, 'lvl3-bg', 'bg5');   // Background 5 (elevator bottom floor)
		this.bg1 = game.add.image(800, 0, 'lvl3-bg', 'bg9'); // Background 9 (third gear and platform keys)
		game.world.setBounds(0, 0, 1600, this.bg1.height);

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('lvl1', 0.5, true);
		this.bgm.play();

		// Create sound effects for when a music block platform is created
		this.platform1audio = game.add.audio('platform1audio');
		this.platform2audio = game.add.audio('platform2audio');
		this.platform3audio = game.add.audio('platform3audio');
		this.platform4audio = game.add.audio('platform4audio');
	
		this.key1 = game.add.sprite(-1000, -1000, 'assets', 'box');
		this.key2 = game.add.sprite(-1000, -1000, 'assets', 'box');
		this.key3 = game.add.sprite(-1000, -1000, 'assets', 'box');

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
		this.gear = game.add.sprite(1420, 370, 'assets', 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.scale.setTo(0.75);
		this.gear.anchor.set(0.5);	

		/***** PLAYER SPRITE *****/ 
		//this.players = game.add.group();
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 1215, 485, this.levelScale); // -800
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


	},
	update: function() {
		//console.log(level);
		//console.log(inElevator);
		this.checkCamBounds();
		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);
		game.physics.arcade.overlap(this.player, this.elevator, activateElevatorUp, null, this);

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
				if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && numPlatforms > 0) {
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
					this.createdPlatform.scale.setTo(0.33);
					numPlatforms--;
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

		// numPlatforms doesn't refresh until the player hits the ground
		if(!inElevator){
			if(reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform)) {
				numPlatforms++;
				reloadOnGround--;	
			}
		}
		// Top-left number updates with numPlatforms
		if(numPlatforms == 0) {
			this.number0.scale.set(0.5);
			this.number1.scale.set(0);
			this.number2.scale.set(0);
			this.number3.scale.set(0);
			this.number4.scale.set(0);
		}
		else if(numPlatforms == 1) {
			this.number0.scale.set(0);
			this.number1.scale.set(0.5);
			this.number2.scale.set(0);
			this.number3.scale.set(0);
			this.number4.scale.set(0);
		}
		else if(numPlatforms == 2) {
			this.number0.scale.set(0);
			this.number1.scale.set(0);
			this.number2.scale.set(0.5);
			this.number3.scale.set(0);
			this.number4.scale.set(0);
		}
		else if(numPlatforms == 3) {
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

		if(inElevator){
			this.timer++;
			if(this.timer >= 120){
				this.bgm.destroy();
				game.state.start('Level4');
			}
		}
		
		// Animate Gear
		this.gear.angle += 1;
	},

	render: function() {
		game.debug.body(this.pedestal);
		game.debug.body(this.player);
		game.debug.body(this.box);
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
	}
}

// Functions for playing the platform audio sounds
function platformSound1(){
	this.platform1audio.play();
}

function platformSound2(){
	this.platform2audio.play();
}

function platformSound3(){
	this.platform3audio.play();
}

function platformSound4(){
	this.platform4audio.play();
}

// Function for activating the elevator to go up
function activateElevatorUp(Patches, elevator){
	if(!inElevator){
		// When spacebar pressed and player is standing
		if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.player.body.touching.down){
		
			this.player.x = 415;
		    this.player.y = 485;	
   			inElevator = true;
		    
		    // KILL THE PLAYER, BOX AND THE CURRENT ELEVATOR SPRITE
			this.player.destroy();
			this.box.destroy();
			this.elevators.removeAll(true);

			// Creates a new elevator sprite with its doors closed, but active
			this.elevator = this.elevators.create(310, 330, 'lvl3', 'elevator2'); 
			this.elevator.scale.setTo(0.5);
			
			// Fade out effect
			if(inElevator){
				game.camera.fade(0x000000, 4000);
			}
		}
	}
}

// Function for collecting "gears"
function collectGear(Patches, gear){
	gear.kill();
	numPlatforms++;
	this.gearAudio = game.add.audio('collect-gear', 0.25, false);	
	this.gearAudio.play();
}