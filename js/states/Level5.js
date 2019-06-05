var Level5 = function(game) {};
Level5.prototype = {
	init: function() {
		numPlatforms = 2;
		reloadOnGround = 0;
		this.levelScale = 1.0;
		self = this;
		inElevator = false;
		traveling = false;	
		level = 5;
		timer = 0;
	},
	create: function() {
		this.bg0 = game.add.image(0, 0, 'bg0');
		this.bg1 = game.add.image(800, 0, 'bg1');
		game.world.setBounds(0, 0, 1600, this.bg1.height);

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('bgm', 0.1, true);

		this.wya = game.add.text(350, 230, 'CURRENTLY ON BOTTOM LEVEL', textStyle);
		this.wya.anchor.set(0.5);
	
	

		/***** PLATFORMS *****/
		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		//Create createdPlatforms group
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		// Create invisible ground platform for player to stand on (both scenes)
		this.ground = platforms.create(-1600, 550, 'atlas', 'sky'); 
		this.ground.scale.setTo(25, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		//this.ground.visible = false;


		this.elevator = platforms.create(350, 380, 'lvl3', 'elevator3'); 
		this.elevator.scale.setTo(0.4, 0.4);
		game.physics.arcade.enable(this.elevator);
		this.elevator.body.immovable = true;
		this.elevator.body.checkCollision.up = false;
	    this.elevator.body.checkCollision.down = false;
	    this.elevator.body.checkCollision.left = false;
	    this.elevator.body.checkCollision.right = false;

		// Library1 setup
		this.ceiling1 = platforms.create(0, 0, 'atlas', 'sky'); 
		this.ceiling1.scale.setTo(2.5, 0.5);
		game.physics.arcade.enable(this.ceiling1);
		this.ceiling1.body.immovable = true;
		//this.ground.visible = false;

		this.ceiling2 = platforms.create(480, 0, 'atlas', 'sky'); 
		this.ceiling2.scale.setTo(2.5, 0.5);
		game.physics.arcade.enable(this.ceiling2);
		this.ceiling2.body.immovable = true;
		//this.ground.visible = false;

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
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 415, 485, this.levelScale);
		//this.player = new Patches(game, 'patchesAtlas2', 'right1', 850, 300, this.levelScale);
		this.player.enableBody = true;
		game.add.existing(this.player);
		//this.players.add(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets','box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.75 * this.levelScale);
		this.box.body.collideWorldBounds = false;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = true; // Held from last level

		//game.camera.onFadeComplete.add(goToLevel4, this);

	},
	update: function() {
		//console.log(level);
		console.log(inElevator);

		this.checkCamBounds();
		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);
				game.physics.arcade.overlap(this.player, this.elevator, activateElevatorUp, null, this);




		// reset state when player falls
		// if(this.player.y + this.player.height/2 >= this.world.height - 1) {
		// 	game.state.start('Level4');
		// }

		/***** BOX STUFF *****/
		this.box.body.velocity.x = 0; // Box won't glide when pushed by player

		// When holding the box...
		if(this.attached) {
			// When facing right, the box moves immediately to the player's right
			this.box.body.checkCollision.none = true;
			if(this.player.facing == "RIGHT") { 
				this.box.x = this.player.x + this.player.width/2 + this.box.width/2 + 1;
			}

			// When facing left, the box moves immediately to the player's left
			else{ 
				this.box.x = this.player.x - this.player.width/2 - this.box.width/2 - 1;	
			}

			this.box.y = this.player.y;	 // the box is off the ground and with the player
			this.box.body.gravity.y = 0; // box doesn't fall when you're holding it

			// Spawn platform directly under by pressing SPACEBAR
			if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && numPlatforms > 0) {
				this.platform1audio = game.add.audio('platform1audio');
				this.platform1audio.play();
				this.createdPlatform = new Platform(game, 'assets', 'music-block', this.player.x, this.player.y + this.player.height/2 + 30 * this.levelScale, this.levelScale);
				this.createdPlatforms.add(this.createdPlatform); 
				game.physics.arcade.enable(this.createdPlatform);
				this.createdPlatform.body.checkCollision.down = false;
				this.createdPlatform.body.checkCollision.left = false;
				this.createdPlatform.body.checkCollision.right = false;
				this.createdPlatform.body.setSize(this.createdPlatform.body.width*10 - 80, this.createdPlatform.body.height*10 - 200, this.createdPlatform.body.width/2 , this.createdPlatform.body.height/2 + 45);
				this.createdPlatform.body.immovable = true;
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
			timer++;
			if(timer >= 120){
				game.state.start('Level4');
			}
		}
		
	},

	render: function() {
		game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.rectangle({x:game.camera.bounds.x, y:game.camera.bounds.y, width:game.camera.bounds.width, height:game.camera.bounds.height});
	},

	checkCamBounds: function() {
		// some funky, funky logic to check camera bounds for player movement
		if(this.player.x + Math.abs(this.player.width/2) > game.width + game.camera.x && !this.player.body.blocked.right && this.player.facing === "RIGHT") {
			// move camera, then player
			game.camera.x += game.width;
			this.player.x = game.camera.x + Math.abs(this.player.width/2);	
		} 
		else if(this.player.x - Math.abs(this.player.width/2) < game.camera.x && !this.player.body.blocked.left && this.player.facing === "LEFT") {
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

function goToLevel4(){
	    //game.camera.resetFX();
	if(inElevator){
		console.log('going to level 4');
		inElevator = false;
		game.state.start('Level4');
	}
}

// Function for collecting "gears"
function activateElevatorUp(Patches, elevator){

	if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.player.body.touching.down){
	
		this.player.x = 415;
	    this.player.y = 485;	
	    
		inElevator = true;
		this.player.destroy();
		this.elevator = platforms.create(350, 380, 'lvl3', 'elevator2'); 
		this.elevator.scale.setTo(0.4, 0.4);
		// this.player.body.checkCollision.up = false;
	 //    this.player.body.checkCollision.down = false;
	 //    this.player.body.checkCollision.left = false;
	 //    this.player.body.checkCollision.right = false;
	 //    this.player.body.collideWorldBounds = false;
	 //    this.player.body.gravity.y = 0;
		// this.player.body.velocity.y = -75;
		// this.elevator.body.velocity.y = -75;

		if(inElevator){
			game.camera.fade(0x000000, 4000);
		}

			   // game.camera.onFadeComplete.add(goToLevel4, this);

	}
}