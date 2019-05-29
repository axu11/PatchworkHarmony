// Second level state, rooftops
var Level2 = function(game) {};
Level2.prototype = {

	init: function() {
		numPlatforms = 1;
		this.levelScale = 0.4;
		self = this;
	},

	create: function() {

		/***** BG, BGM, AND NUMBER CIRCLE *****/
		// Create backgrounds for both scenes, set bounds to image resolution (800 x 600)
		this.bg = game.add.image(0, 0, 'bg2');
		this.bg2 = game.add.image(800, 0, 'bg3');
		game.world.setBounds(0, 0, this.bg.width+800, this.bg.height);

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('bgm', 0.1, true);
		//this.bgm.play();
		


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

		//Create createdPlatforms group
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		// Create invisible ground platform for player to stand on (both scenes)
		this.ground = platforms.create(0, 530, 'lvl2', 'exterior'); 
		this.ground.scale.setTo(0.5, 0.25);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;

		// billboard
		this.billboard = platforms.create(170, 430, 'lvl2', 'billboard');
		this.billboard.scale.setTo(0.25, 0.3);
		game.physics.arcade.enable(this.billboard);
		this.billboard.body.setSize(500, 350, 150, 65);
		this.billboard.body.immovable = true;

		// building
		this.building = platforms.create(500, 490, 'lvl2', 'rooftop');
		this.building.scale.setTo(0.6, 0.4);
		game.physics.arcade.enable(this.building);
		this.building.body.immovable = true;

		// ledge
		this.ledge = platforms.create(600, 350, 'assets', 'shelf-platform');
		this.ledge.scale.setTo(0.15, 0.3);
		game.physics.arcade.enable(this.ledge);
		this.ledge.body.immovable = true;

		// big ass tower

		this.secondRooftop = platforms.create(700, 490, 'lvl2', 'rooftop');
		this.secondRooftop.scale.setTo(0.6, 0.4);
		game.physics.arcade.enable(this.secondRooftop);
		//this.tower.body.setSize(200, 500, 0, 140);
		this.secondRooftop.body.immovable = true;

		// big ass tower
		this.tower = platforms.create(630, 100, 'lvl2', 'clocktower');

		this.tower.scale.setTo(1, 1);
		game.physics.arcade.enable(this.tower);
		this.tower.body.setSize(170, 500, 0, 140);
		this.tower.body.immovable = true;

		this.droppedPlatform = platforms.create(985, 245, 'crane-platform'); 
		this.droppedPlatform.scale.setTo(1.5, 1);
		game.physics.arcade.enable(this.droppedPlatform);
		this.droppedPlatform.body.immovable = false;
	
		// big ass tower
		this.library = platforms.create(1400, 300, 'library');
		this.library.scale.setTo(1, 1);
		game.physics.arcade.enable(this.library);
		this.library.body.setSize(200, 200, 0, 170);
		this.library.body.immovable = true;

		// trampoline
		this.trampoline = game.add.sprite(100, 375, 'assets', 'shelf-platform');
		this.trampoline.anchor.setTo(0.5, 1);
		this.trampoline.scale.setTo(0.3, 0.3);
		game.physics.arcade.enable(this.trampoline);
		this.trampoline.body.immovable = true;
		this.trampoline.body.checkCollision.down = false;
		this.trampoline.body.checkCollision.left = false;
		this.trampoline.body.checkCollision.right = false;

		// create bounce sound
		this.jump = game.add.audio('jump', 0.1, false);

		// Creates a collectible "gear" that will enable player to unlock an ability
		this.gear = game.add.sprite(120, 80, 'assets', 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.scale.setTo(0.5, 0.5);	

		/***** PLAYER SPRITE *****/ 
		this.players = game.add.group();
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 50, 450, this.levelScale);
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

	update: function(){
		//game.debug.body(this.billboard);
		//game.debug.body(this.tower);
		//game.debug.body(this.secondRooftop);
		//game.debug.body(this.library);
		//game.debug.body(this.droppedPlatform);

		this.checkCamBounds();

		this.droppedPlatform.y += 4;
		if(this.droppedPlatform.y > 900){
			this.droppedPlatform.y = 245;
		}

		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		this.hitMusicPlatform = game.physics.arcade.collide(this.droppedPlatform, this.createdPlatform);   // box vs platforms
		this.hitTrampoline = game.physics.arcade.collide(this.player, this.trampoline);
		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);
		
		// trampoline bounce logic
		if((this.player.x + this.player.width/2 >= (this.trampoline.x - this.trampoline.width/2 - 2) && this.player.x - this.player.width/2 <= (this.trampoline.x + this.trampoline.width/2 + 2)) &&
			(((this.player.y + this.player.height/2) >= (this.trampoline.y - this.trampoline.height - 15)) && this.player.y + this.player.height/2 <= this.trampoline.y - this.trampoline.height + 1)) {
				// if(this.hitTrampoline) {
					console.log('bounce');
					this.player.body.bounce.y = 1;
				// }
			}
			// else {
			// 	this.player.body.bounce.y = 0;
			// }
		}
		else {
				this.player.body.bounce.y = 0;
			}

		// play bounce sound on bounce
		if(this.hitTrampoline) {
			this.jump.play();
		}

		if(this.hitMusicPlatform){
			console.log('hit');
			this.droppedPlatform.y -= 4;
		}

		// reset state when player falls
		if(this.player.y + this.player.height/2 >= this.world.height - 1) {
			game.state.start('Level2');
		}
		
		if(this.player.x > 1400 && this.player.y < 240){
			game.state.start('GameOver');
			this.bgm.destroy();
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
				this.createdPlatform = new Platform(game, 'assets', 'Platform-1', this.player.x, this.player.y + this.player.height/2 + 30 * this.levelScale, this.levelScale);
				this.createdPlatforms.add(this.createdPlatform); 
				game.physics.arcade.enable(this.createdPlatform);
				this.createdPlatform.body.checkCollision.down = false;
				this.createdPlatform.body.checkCollision.left = false;
				this.createdPlatform.body.checkCollision.right = false;
				this.createdPlatform.body.setSize(this.createdPlatform.body.width*10 - 80, this.createdPlatform.body.height*10 - 200, this.createdPlatform.body.width/2 , this.createdPlatform.body.height/2 + 45);
				this.createdPlatform.body.immovable = true;
				numPlatforms--;
			}

			console.log(reloadOnGround); 

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
			if(reloadOnGround > 0 && this.player.body.touching.down && (this.hitPlatform || this.hitTrampoline)) {
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
	},
	render: function() {

	},

	checkCamBounds: function() {
	if(this.player.x + Math.abs(this.player.width/2) > game.width + game.camera.x && !this.player.body.blocked.right && this.player.facing === "RIGHT") {
		// move camera, then player
		game.camera.x += game.width;
		this.player.x = game.camera.x + Math.abs(this.player.width/2);	
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