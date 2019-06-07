var Level3 = function(game) {};
Level3.prototype = {
	init: function() {
		numPlatforms = 2;
		reloadOnGround = 0;
		this.levelScale = 0.6;
		self = this;
	},
	create: function() {
		this.bg = game.add.image(0, 0, 'bg3');

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('lvl2', 0.25, true);
		this.bgm.play();

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

		this.key1 = game.add.sprite(-1000, -1000, 'assets', 'box');
		this.key2 = game.add.sprite(-1000, -1000, 'assets', 'box');
		this.key3 = game.add.sprite(-1000, -1000, 'assets', 'box');
		
		/***** PLATFORMS *****/
		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		//Create createdPlatforms group
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		this.droppedPlatform = platforms.create(185, 245, 'crane-platform'); 
		this.droppedPlatform.scale.setTo(1.5, 1);
		game.physics.arcade.enable(this.droppedPlatform);
		this.droppedPlatform.body.setSize(260, 20, 0, 75);
		this.droppedPlatform.body.immovable = true;
		this.droppingPlatform = true;
	
		this.secondRooftop = platforms.create(-100, 490, 'lvl2', 'rooftop');
		this.secondRooftop.scale.setTo(0.6, 0.4);
		game.physics.arcade.enable(this.secondRooftop);
		//this.tower.body.setSize(200, 500, 0, 140);
		this.secondRooftop.body.immovable = true;

		// big ass tower
		this.library = platforms.create(600, 300, 'library');
		this.library.scale.setTo(1, 1);
		game.physics.arcade.enable(this.library);
		this.library.body.setSize(200, 200, 0, 170);
		this.library.body.immovable = true;

		/***** PLAYER SPRITE *****/ 
		this.players = game.add.group();
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 50, 430, this.levelScale);
		//this.player = new Patches(game, 'patchesAtlas2', 'right1', 850, 300, this.levelScale);
		this.player.enableBody = true;
		this.players.add(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets','box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.75 * this.levelScale);
		this.box.body.collideWorldBounds = false;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = true; // Held from last level

	},
	update: function() {
		if(this.droppingPlatform) {
			this.droppedPlatform.y += 4;
			if(this.droppedPlatform.y > 900){
				this.droppedPlatform.y = 245;
			}
		}

		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		this.carryDroppedPlatform = game.physics.arcade.collide(this.droppedPlatform, this.createdPlatforms);   // dropped vs  created platforms
		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);

		if(this.carryDroppedPlatform){
			console.log('hit');
			this.droppingPlatform = false;
		}
		else {
			this.droppingPlatform = true;
		}

		// reset state when player falls
		if(this.player.y + this.player.height/2 >= this.world.height - 1) {
			// stop music
			this.bgm.stop();
			
			game.state.start('Level3');
		}

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
			if(reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform)) {
				numPlatforms++;
				reloadOnGround--;	
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
	}
}