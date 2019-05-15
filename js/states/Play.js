// First level state for the game, shows our tutorial and core mechanics
var Play = function(game) {};
Play.prototype = {

	init: function() {
		numPlatforms = 0;
	},

	create: function() {
		
		/***** BG, BGM, AND NUMBER CIRCLE *****/
		// Create backgrounds for both scenes, set bounds to image resolution (800 x 600)
		this.bg = game.add.image(0, 0, 'bg1');
		this.bg2 = game.add.image(800, 0, 'bg1');
		game.world.setBounds(0, 0, this.bg.width+800, this.bg.height);

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('bgm', 0.1, true);
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

		/***** INSTRUCTION TEXT *****/
		// Create instructions for player movement and pickup, overlaid on screen for now
		this.moveInstructions = game.add.text(150, 230, 'Use the arrow keys to move and jump!', style2);
		this.moveInstructions.anchor.set(0.5);
		this.pickupInstrucctions = game.add.text(350, 330, 'Press SHIFT next to the box to pick it up and put it down!', style2);
		this.pickupInstrucctions.anchor.set(0.5);

		// Create instructions for collecting the "apple" and ability gained afterwards (initially invisible)
		this.gearInstructions = game.add.text(1200, 50, 'Collect the apple!', style2);
		this.gearInstructions.anchor.set(0.5);
		this.platformInstructions = game.add.text(1200, 50, 'Press SPACEBAR when holding the box to make a temporary platform!', style2);
		this.platformInstructions.anchor.set(0.5);
		this.platformInstructions.visible = false;

		/***** PLAYER SPRITE *****/ 
		this.players = game.add.group();
		this.player = new Patches(game, 'patches', 100, 400);
		this.player.enableBody = true;
		this.players.add(this.player);
		
		// Set up future player animations
		// this.player.animations.add('right', Phaser.Animation.generateFrameNames('furretWalk', 1, 4, '', 4), 10, true);
		// this.player.animations.add('left', Phaser.Animation.generateFrameNames('furretWalk', 5, 8, '', 4), 10, true);
		// this.player.animations.add('idleRight', ['furretWalk0001'], 30, false);
		// this.player.animations.add('idleLeft', ['furretWalk0005'], 30, false);
	
		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.75);
		this.box.body.collideWorldBounds = true;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = false; // Initially not picked up by player

		/***** PLATFORMS *****/
		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		// Create invisible ground platform for player to stand on (both scenes)
		this.ground = platforms.create(-64, 550, 'atlas', 'sky'); 
		this.ground.scale.setTo(13, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.body.allowGravity = false;
		this.ground.visible = false;

		// Create invisible platform on top of drawer, only collides on top (scene 2)
		this.drawer = platforms.create(1020, 380, 'atlas','sky');
		game.physics.arcade.enable(this.drawer);
		this.drawer.scale.setTo(0.75, 0.075);
		this.drawer.body.immovable = true;
		this.drawer.body.allowGravity = false;
		this.drawer.body.checkCollision.down = false;
		this.drawer.body.checkCollision.left = false;
		this.drawer.body.checkCollision.right = false;
		this.drawer.alpha = 0;

		// Create invisible platform on top of table, only collides on top (scene 2)
		this.table = platforms.create(820, 430, 'atlas','sky');
		game.physics.arcade.enable(this.drawer);
		this.table.scale.setTo(1.35, 0.075);
		this.table.body.immovable = true;
		this.table.body.allowGravity = false;
		this.table.body.checkCollision.down = false;
		this.table.body.checkCollision.left = false;
		this.table.body.checkCollision.right = false;
		this.table.alpha = 0;

		// Creates a visible platform that lowers once switch is activated
		this.activatedPlatformStartX = 800;
		this.activatedPlatform = platforms.create(this.activatedPlatformStartX, 300, 'shelf');
		this.activatedPlatform.scale.setTo(0.55, 0.55);
		this.activatedPlatform.angle += 270;
		this.activatedPlatformXSize = 10;
		this.activatedPlatformYSize = 1280;
		this.activatedPlatformXOffset = 0;
		this.activatedPlatformYOffset = -1280;
		this.activatedPlatform.body.setSize(this.activatedPlatformXSize, this.activatedPlatformYSize, this.activatedPlatformXOffset, this.activatedPlatformYOffset);
		game.physics.arcade.enable(this.activatedPlatform);
		this.activatedPlatform.body.immovable = true;
		this.activatedPlatform.body.allowGravity = false;

		/***** SWITCH MECHANIC *****/
		this.switches = game.add.group();
		this.switches.enableBody = true;
		this.switch = new Switch(game, 'switch-button', 1250, 525); // Temp sprite
		this.switches.add(this.switch);
		this.switch.body.immovable = true;
		this.switch.scale.setTo(0.2, 0.001);
		this.switch.body.allowGravity = false;
		this.switchHolder = game.add.sprite(1160, 500, 'switch-holder')
		this.switches.add(this.switchHolder)
		this.switchHolder.scale.setTo(0.2, 0.25);
		this.switchHolder.body.immovable = true;

		/***** MISC COLLECTIBLES AND SPRITES *****/
		// Creates a window for player to get to in order to clear level
		this.window = game.add.sprite(1320, 70, 'window');
		this.window.scale.setTo(0.5, 0.5);

		// Creates a collectible "gear" that will enable player to unlock an ability
		this.gear = game.add.sprite(820, 80, 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.body.allowGravity = false;
		this.gear.scale.setTo(0.5,0.5);	
	},

	update: function() {
		
		/***** DEBUG STUFF *****/
		//game.debug.body(this.box);
		//game.debug.body(this.ground);
		//game.debug.body(this.activatedPlatform);
		//game.debug.body(this.drawer);
		//console.log(this.activatedPlatform.angle);
		//console.log(numPlatforms);
		this.checkCamBounds(); // Keep checking camera bounds

		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);   // player vs platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitSwitch = game.physics.arcade.collide(this.player, this.switches); // player vs switch
		this.hitDrawer = game.physics.arcade.collide(this.player, this.drawer); // box vs switch
		this.hitTable = game.physics.arcade.collide(this.player, this.table); // box vs switch
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);   // box vs platforms
		this.boxHitSwitch = game.physics.arcade.collide(this.box, this.switches); // box vs switch
		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);
		
		/***** SWITCH STUFF *****/
		// Switch logic for player pressing down on switch 
		if(this.hitSwitch && this.player.y + this.player.height/2 < this.switch.y - this.switch.height) {
			this.playerOnSwitch = true;
			this.switchPressed = true;
		}
		if(this.playerOnSwitch && !this.hitSwitch && (this.player.x + this.player.width/2 < this.switch.x - this.switch.width/2 || this.player.x - this.player.width/2 > this.switch.x + this.switch.width/2 || this.player.y + this.player.height/2 < this.switch.y + this.switch.height - 50))  {
			this.playerOnSwitch = false;
			this.switchPressed = false;
		}

		// Switch logic for box pressing down on switch
		if(this.boxHitSwitch && this.box.y + this.box.height/2 < this.switch.y - this.switch.height) {
			this.boxOnSwitch = true;
			this.switchPressed = true;
		}
		if(this.boxOnSwitch && !this.boxHitSwitch && (this.box.x + this.box.width/2 < this.switch.x - this.switch.width/2 || this.box.x - this.box.width/2 > this.switch.x + this.switch.width/2)) {
			this.boxOnSwitch = false;
			this.switchPressed = false;
		}

		// When the switch is pressed, it will visibly shrink down (y scale decreases)
		if(this.switchPressed) {
			if(this.switch.scale.y > 0.01) {
				this.switch.scale.setTo(0.2, this.switch.scale.y - 0.01);
			}
		}
		else {
			if(this.switch.scale.y < 0.25) {
				this.switch.scale.setTo(0.2, this.switch.scale.y + 0.01);
			}
		}

		if(this.player.x > 1400 && this.player.y < 240){
			game.state.start('GameOver');
			this.bgm.destroy();
		}

		// When the switch is pressed, platform is lowered, otherwise will go back to being raised
		if(this.switchPressed) {
			if(this.activatedPlatform.angle < 0) { 
				this.activatedPlatform.angle += 1;
				this.activatedPlatformXSize += 38/9;
				this.activatedPlatformYSize -= 122/9;
				this.activatedPlatformYOffset += 128/9;
			}
		}
		else{
			if(this.activatedPlatform.angle > -90){
				this.activatedPlatform.angle -= 1;
				this.activatedPlatformXSize -= 38/9;
				this.activatedPlatformYSize += 122/9;
				this.activatedPlatformYOffset -= 128/9;
			}
		}

		this.activatedPlatform.body.setSize(this.activatedPlatformXSize, this.activatedPlatformYSize, this.activatedPlatformXOffset, this.activatedPlatformYOffset); // Change platform offset bounding box

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
				this.createdPlatform = new Platform(game, ['platform1'/*, 'platform2', 'platform3', 'platform4'*/], this.player.x, this.player.y + this.player.height/2 + 30);
				platforms.add(this.createdPlatform); 
				game.physics.arcade.enable(this.createdPlatform);
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
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.rectangle({x:game.camera.bounds.x, y:game.camera.bounds.y, width:game.camera.bounds.width, height:game.camera.bounds.height});
	},

	checkCamBounds: function() {
		// some funky, funky logic to check camera bounds for player movement
		if(this.player.x + Math.abs(this.player.width/2) > game.width + game.camera.x && !this.player.body.blocked.right && this.player.facing === "RIGHT") {
			// move camera, then player
			game.camera.x += game.width;
			this.player.x = game.camera.x + Math.abs(this.player.width/2);	
		} else if(this.player.x - Math.abs(this.player.width/2) < game.camera.x && !this.player.body.blocked.left && this.player.facing === "LEFT") {
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
	this.gearInstructions.visible = false;
	this.platformInstructions.visible = true;
}