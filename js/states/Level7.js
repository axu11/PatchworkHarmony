var Level7 = function(game) {};
Level7.prototype = {
	init: function(numPlatforms) {
		this.numPlatforms = 3;
		reloadOnGround = 0;
		self = this;
		level = 5;
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
		this.bg0 = game.add.image(0, 0, 'atlas', 'tree');   // Background 5 (elevator bottom floor)
		game.world.setBounds(0, 0, 800, 600);
		
		this.asdadasdnasdsadsa = game.add.text(game.world.centerX, game.world.centerY, 'WE ARE ON THE LAST LEVEL ASDJSADBSADKSA', textStyle);
		// Create bgm for game, looped and played
		this.bgm = game.add.audio('lvl1', 0.5, true);
		this.bgm.play();

		// Create sound effects for when a music block platform is created
		this.platform1audio = game.add.audio('platform1audio');
		this.platform2audio = game.add.audio('platform2audio');
		this.platform3audio = game.add.audio('platform3audio');
		this.platform4audio = game.add.audio('platform4audio');

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

	 //    // Creates an invisible leftmost wall 
		// this.leftWall = platforms.create(0, 0, 'lvl3', 'bookshelf1'); 
		// this.leftWall.scale.setTo(0.5, 1.5);
		// game.physics.arcade.enable(this.leftWall);
		// this.leftWall.body.immovable = true;
		// this.leftWall.alpha = 0;

		// // Creates an invisible leftmost wall 
		// this.rightWall = platforms.create(800, 0, 'lvl3', 'bookshelf1'); 
		// this.rightWall.scale.setTo(0.5, 1.5);
		// game.physics.arcade.enable(this.rightWall);
		// this.rightWall.body.immovable = true;
		// this.rightWall.alpha = 0;

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


	},
	update: function() {
		//console.log(level);
		//console.log(inElevator);
		// console.log(game.camera.x);
		// console.log(game.camera.y);
		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platform

		if(game.input.keyboard.addKey(Phaser.KeyCode.Q).justPressed()){
			elevatorActivated = true;
			cutscenePlaying = true;
			this.keySolved = true;
			//wallShifted = true;
		}

		if(game.input.keyboard.addKey(Phaser.KeyCode.W).justPressed()){
			reactivateCamera();
		}

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

				// Spawn platform directly under by pressing SPACEBAR
				if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.numPlatforms > 0 && !cutscenePlaying) {
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
		

		// this.numPlatforms doesn't refresh until the player hits the ground

			if(reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform)) {
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

	render: function() {
		// game.debug.body(this.pedestal);
		// game.debug.body(this.player);
		// game.debug.body(this.box);
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.rectangle({x:game.camera.bounds.x, y:game.camera.bounds.y, width:game.camera.bounds.width, height:game.camera.bounds.height});
	},

	
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
