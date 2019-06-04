var Level4 = function(game) {};
Level4.prototype = {
	init: function() {
		bookTop = true;
		numPlatforms = 2;
		reloadOnGround = 0;
		this.levelScale = 1.0;
		inElevator = false;
		self = this;	
		level = 4;
	},
	create: function() {
		this.bg0 = game.add.image(-1600, 0, 'bg0');
		this.bg1 = game.add.image(-800, 0, 'bg1');
		this.bg2 = game.add.image(0, 0, 'bg2');
		this.bg3 = game.add.image(800, 0, 'bg3');
		game.world.setBounds(-1600, 0, 3200, this.bg1.height);

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('bgm', 0.1, true);

			this.wya = game.add.text(350, 230, 'CURRENTLY ON TOP LEVEL', textStyle);
		this.wya.anchor.set(0.5);
	

		this.switches = game.add.group();
		this.switches.enableBody = true;
		this.switch = new Switch(game, 'assets', 'switch-button', 690, 230); // Temp sprite
		this.switches.add(this.switch);
		this.switch.body.immovable = true;
		this.switch.scale.setTo(0.1, 0.125);

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

		// LIBRARY 1
		this.elevator = platforms.create(350, 410, 'atlas', 'red'); 
		this.elevator.scale.setTo(1, 1.1);
		game.physics.arcade.enable(this.elevator);
		this.elevator.body.immovable = true;
		this.elevator.body.checkCollision.up = false;
	    this.elevator.body.checkCollision.down = false;
	    this.elevator.body.checkCollision.left = false;
	    this.elevator.body.checkCollision.right = false;

		// Library1 setup

		this.shiftingWall1 = platforms.create(0, 50, 'atlas', 'red'); 
		this.shiftingWall1.scale.setTo(0.5, 3.9);
		game.physics.arcade.enable(this.shiftingWall1);
		this.shiftingWall1.body.immovable = true;

		this.shiftingWall2 = platforms.create(740, 50, 'atlas', 'red'); 
		this.shiftingWall2.scale.setTo(0.5, 3.91);
		game.physics.arcade.enable(this.shiftingWall2);
		this.shiftingWall2.body.immovable = true;


		this.ceiling1 = platforms.create(0, 0, 'atlas', 'sky'); 
		this.ceiling1.scale.setTo(2.5, 0.5);
		game.physics.arcade.enable(this.ceiling1);
		this.ceiling1.body.immovable = true;

		this.ceiling2 = platforms.create(480, 0, 'atlas', 'sky'); 
		this.ceiling2.scale.setTo(2.5, 0.5);
		game.physics.arcade.enable(this.ceiling2);
		this.ceiling2.body.immovable = true;

		

		// Creates a visible platform that lowers once switch is activated
		this.activatedPlatform = platforms.create(565, 230, 'assets', 'shelf-platform');
		this.activatedPlatform.scale.setTo(0.45, 0.45);
		game.physics.arcade.enable(this.activatedPlatform);
		this.activatedPlatform.body.immovable = true;

		

		this.switchHolder = game.add.sprite(690, 230, 'assets', 'switch-holder');
		this.switchHolder.anchor.set(0.5, 1);
		platforms.add(this.switchHolder);
		this.switchHolder.scale.setTo(0.1, 0.125);
		this.switchHolder.body.immovable = true;

		
		
		// LIBRARY 2
		this.bookshelf = platforms.create(-895, 145, 'atlas', 'red'); 
		this.bookshelf.scale.setTo(1.5, 3.16);
		game.physics.arcade.enable(this.bookshelf);
		this.bookshelf.body.immovable = true;

		this.book1 = platforms.create(-600, 200, 'atlas', 'red'); 
		this.book1.scale.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.book1);
		this.book1.body.immovable = true;

		this.book2 = platforms.create(-400, 350, 'atlas', 'red'); 
		this.book2.scale.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.book2);
		this.book2.body.immovable = true;


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
		//this.player = new Patches(game, 'patchesAtlas2', 'right1', 415, 485, this.levelScale);
		this.player = new Patches(game, 'patchesAtlas2', 'right1', -615, 485, this.levelScale);
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




	},
	update: function() {
		//console.log(this.player.x);
		//console.log(this.player.y);
		//console.log(level);
		console.log(bookTop);
		this.checkCamBounds();
		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); // player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		this.hitSwitch = game.physics.arcade.collide(this.player, this.switches); // player vs switch
		this.boxHitSwitch = game.physics.arcade.collide(this.box, this.switches); // box vs switch

		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);
		game.physics.arcade.overlap(this.player, this.elevator, activateElevatorDown, null, this);

		// If books are are the top of their range of movement, move them down
		if(bookTop){
			// Move books down (increase y)
			this.book1.y += 2;
			this.book2.y += 2;

			// If book y position is at the bottom of its range of movement, set top boolean to false
			if(this.book1.y >= 330){
				bookTop = false;
			}
		}

		// Else that means they are at the bottom, move them up
		else{
			this.book1.y -= 2;
			this.book2.y -= 2;
			if(this.book1.y <= 200){
				bookTop = true;
			}
		}

		/***** SWITCH STUFF *****/
		// Switch logic for player pressing down on switch 
		if(this.hitSwitch && this.player.x > this.switch.x - this.switch.width/2 && this.player.x < this.switch.x + this.switch.width/2) {
			this.playerOnSwitch = true;
			this.switchPressed = true;
		}
		if(this.playerOnSwitch && !this.hitSwitch && (this.player.x + this.player.width/2 < this.switch.x - this.switch.width/2 || this.player.x - this.player.width/2 > this.switch.x + this.switch.width/2 || this.player.y + this.player.height/2 < this.switch.y - this.switch.height - 30))  {
			this.playerOnSwitch = false;
		}

		// Switch logic for box pressing down on switch
		if(this.boxHitSwitch && this.box.x > this.switch.x - this.switch.width/2 && this.box.x < this.switch.x + this.switch.width/2) {
			this.boxOnSwitch = true;
			this.switchPressed = true;
		}
		if(this.boxOnSwitch && !this.boxHitSwitch && (this.box.x + this.box.width/2 < this.switch.x - this.switch.width/2 || this.box.x - this.box.width/2 > this.switch.x + this.switch.width/2)) {
			this.boxOnSwitch = false;
		}

		if(this.switchPressed && !this.playerOnSwitch && !this.boxOnSwitch) {
			this.switchPressed = false;
		}

		// When the switch is pressed, it will visibly shrink down (y scale decreases)
		if(this.switchPressed) {
			if(this.switch.scale.y > 0.01) {
				if(this.switch.scale.y >= 0.125) {
					this.switchTrigger = game.add.audio('switchTrigger');
					this.switchTrigger.play('', 0, 0.1, false);
				}
				this.switch.scale.setTo(0.1, this.switch.scale.y - 0.01);

				if(this.switch.scale.y >= 0.115){
					this.switchTrigger = game.add.audio('switchTrigger');
					this.switchTrigger.play('', 0, 0.5, false);
				}

			}
		}
		else {
			if(this.switch.scale.y < 0.125) {
				this.switch.scale.setTo(0.1, this.switch.scale.y + 0.01);
			}
		}

		if(this.switchPressed) {
			if(this.shiftingWall1.y > -600){
				this.shiftingWall1.y -= 10;
			}
		}
		else{
			if(this.shiftingWall1.y < 50){
				this.shiftingWall1.y += 10;
			}
		}

		// reset state when player falls
		//if(this.player.y + this.player.height/2 >= this.world.height - 1) {
		//	game.state.start('Level4');
		//}

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
				this.platform2audio = game.add.audio('platform2audio', 0.5);
				this.platform2audio.play();
				this.platform3audio = game.add.audio('platform3audio', 0.25);
				this.platform3audio.play();
				this.platform4audio = game.add.audio('platform4audio', 0.125);
				this.platform4audio.play();
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
		if(inElevator){
			if(this.player.y > 650){
				game.state.start('Level5');
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

// Function for collecting "gears"
function collectGear(Patches, gear){
	gear.kill();
	numPlatforms++;
	this.gearAudio = game.add.audio('collect-gear', 0.25, false);	
	this.gearAudio.play();
}

function goToLevel5(){
	    //game.camera.resetFX();
	if(inElevator){
	console.log('going to level 5');

	game.state.start('Level5');
    }
}

// Function for collecting "gears"
function activateElevatorDown(Patches, elevator){
	

	if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.player.body.touching.down){
		if(!inElevator){
			this.player.x = 415;
		    this.player.y = 485;	
	    }
		
		inElevator = true;
		this.player.body.checkCollision.up = false;
	    this.player.body.checkCollision.down = false;
	    this.player.body.checkCollision.left = false;
	    this.player.body.checkCollision.right = false;
	    this.player.body.collideWorldBounds = false;
	    this.player.body.gravity.y = 0;
		this.player.body.velocity.y = 75;
		this.elevator.body.velocity.y = 75;

		if(inElevator){
			game.camera.fade(0x000000, 4000);
		}
			    //game.camera.onFadeComplete.add(goToLevel5, this);

	}
}