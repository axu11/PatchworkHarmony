// First level state for the game, shows our tutorial and core mechanics
var Play = function(game) {};
Play.prototype = {

	init: function() {
		numPlatforms = 0;
	},
	
	create: function() {
		
		/***** BG, BGM, AND NUMBER CIRCLE *****/
		// Create backgrounds for both scenes, set bounds to image resolution (800 x 600)
		this.bg = game.add.image(0, 0, 'bg0');
		this.bg2 = game.add.image(800, 0, 'bg1');
		game.world.setBounds(0, 0, this.bg.width+800, this.bg.height);

		// Create bgm for game, looped and played
		this.bgm = game.add.audio('bgm', 0.1, true);
		this.bgm.play();


		// Create number circle at top left of screen to indicate this.platforms remaining
		this.numberPosition = 16;
		this.number0 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number0');
		this.number0.scale.set(0.65);
		this.number0.fixedToCamera = true;
		this.number1 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number1');
		this.number1.scale.set(0);
		this.number1.fixedToCamera = true;

		/***** INSTRUCTION TEXT *****/
		// Create instructions for player movement and pickup, overlaid on screen for now
		this.moveInstructions = game.add.text(350, 230, 'Use the arrow keys to move and jump!', textStyle);
		this.moveInstructions.anchor.set(0.5);
		this.pickupInstrucctions = game.add.text(375, 330, 'Press SHIFT next to the box to pick it up and put it down!', textStyle);
		this.pickupInstrucctions.anchor.set(0.5);

		// Create instructions for collecting the "apple" and ability gained afterwards (initially invisible)
		this.gearInstructions = game.add.text(1200, 245, 'Collect the gear!', style2);
		this.gearInstructions.anchor.set(0.5);
		this.platformInstructions = game.add.text(1200, 245, 'Press SPACEBAR when holding the box to make a temporary platform!', style2);
		this.platformInstructions.anchor.set(0.5);
		this.platformInstructions.visible = false;

		this.exitInstructions = game.add.text(1200, 265, 'Exit through the window!', style2);
		this.exitInstructions.anchor.set(0.5);
		this.exitInstructions.visible = false;
	
		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'assets', 'box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.75);
		this.box.body.collideWorldBounds = true;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = false; // Initially not picked up by player

			/***** SWITCH MECHANIC *****/
		this.switches = game.add.group();
		this.switches.enableBody = true;
		this.switch = new Switch(game, 'assets', 'switch-button', 1250, 525); // Temp sprite
		this.switches.add(this.switch);
		this.switch.body.immovable = true;
		this.switch.scale.setTo(0.2, 0.25);
		this.switch.body.allowGravity = false;

		/***** PLATFORMS *****/
		// Create this.platforms group
		this.platforms = game.add.group();
		this.platforms.enableBody = true;

		this.switchHolder = game.add.sprite(1250, 525, 'assets', 'switch-holder');
		this.switchHolder.anchor.set(0.5, 1);
		this.platforms.add(this.switchHolder);
		this.switchHolder.scale.setTo(0.2, 0.25);
		this.switchHolder.body.immovable = true;

		// Create invisible ground platform for player to stand on (both scenes)
		this.ground = this.platforms.create(-64, 550, 'atlas', 'sky'); 
		this.ground.scale.setTo(13, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.body.allowGravity = false;
		this.ground.visible = false;

		this.wall = this.platforms.create(700, 0, 'atlas', 'sky');
		this.wall.scale.setTo(0.75,10);
		game.physics.arcade.enable(this.wall);
		this.wall.body.immovable = true;
		this.wall.body.allowGravity = false;
		this.wall.alpha = 0;
		this.wall.body.checkCollision.left = false;

		// Create invisible platform on top of drawer, only collides on top (scene 2)
		this.drawer = this.platforms.create(1020, 400, 'atlas','sky');
		game.physics.arcade.enable(this.drawer);
		this.drawer.scale.setTo(0.65, 0.075);
		this.drawer.body.immovable = true;
		this.drawer.body.allowGravity = false;
		this.drawer.body.checkCollision.down = false;
		this.drawer.body.checkCollision.left = false;
		this.drawer.body.checkCollision.right = false;
		this.drawer.alpha = 0;

		// Create invisible platform on top of table, only collides on top (scene 2)
		this.table = this.platforms.create(820, 430, 'atlas','sky');
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
		this.activatedPlatform = this.platforms.create(this.activatedPlatformStartX, 300, 'assets', 'shelf-platform');
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

		/***** MISC COLLECTIBLES AND SPRITES *****/
		// Creates a window for player to get to in order to clear level
		this.window = game.add.sprite(1320, 70, 'windowAni', 'window0');
		this.window.scale.setTo(0.5, 0.5);
		this.window.animations.add('windowBillow', Phaser.Animation.generateFrameNames('windowAni', 'window', 0, 2), 4, true);
		this.window.animations.play('windowBillow');


		// Creates a collectible "gear" that will enable player to unlock an ability
		this.gear = game.add.sprite(820, 80, 'assets', 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.body.allowGravity = false;
		this.gear.scale.setTo(0.5, 0.5);	

		/***** PLAYER SPRITE *****/ 
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 100, 400, 1);
		this.player.enableBody = true;
		game.add.existing(this.player);
		
		// Set up future player animations
		// this.player.animations.add('right', Phaser.Animation.generateFrameNames('furretWalk', 1, 4, '', 4), 10, true);
		// this.player.animations.add('left', Phaser.Animation.generateFrameNames('furretWalk', 5, 8, '', 4), 10, true);
		// this.player.animations.add('idleRight', ['furretWalk0001'], 30, false);
		// this.player.animations.add('idleLeft', ['furretWalk0005'], 30, false);
	},

	update: function() {
		
		/***** DEBUG STUFF *****/
		//game.debug.body(this.box);
		//game.debug.body(this.ground);
		//game.debug.body(this.wall);
		//game.debug.body(this.activatedPlatform);
		//game.debug.body(this.drawer);
		//console.log(this.activatedPlatform.angle);
		//console.log(numPlatforms);
		console.log(this.switch.scale.y);
		this.checkCamBounds(); // Keep checking camera bounds
		// this.window.animations.play('windowBillow');

		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, this.platforms);   // player vs this.platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         // player vs box
		this.hitSwitch = game.physics.arcade.collide(this.player, this.switches); // player vs switch
		this.hitDrawer = game.physics.arcade.collide(this.player, this.drawer); // box vs switch
		this.hitTable = game.physics.arcade.collide(this.player, this.table); // box vs switch
		this.hitPlatformBox = game.physics.arcade.collide(this.box, this.platforms);   // box vs this.platforms
		this.boxHitSwitch = game.physics.arcade.collide(this.box, this.switches); // box vs switch
		game.physics.arcade.overlap(this.player, this.gear, collectGear, null, this);
		
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
				this.switch.scale.setTo(0.2, this.switch.scale.y - 0.01);
				if(this.switch.scale.y >= 0.24){
					this.switchTrigger = game.add.audio('switchTrigger');
					this.switchTrigger.play('', 0, 0.5, false);
				}
				
			}
		}
		else {
			if(this.switch.scale.y < 0.25) {
				this.switch.scale.setTo(0.2, this.switch.scale.y + 0.01);
			}
		}

		if(this.player.x > 1400 && this.player.y < 240){
			game.state.start('Level2');
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
				this.createdPlatform = new Platform(game, 'assets', 'Platform-1'/*, 'Platform-2', 'Platform-3', 'Platform-4'*/, this.player.x, this.player.y + this.player.height/2 + 30);
				this.platforms.add(this.createdPlatform); 
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
			this.number0.scale.set(0.65);
			this.number1.scale.set(0);
		}
		else {
			this.number0.scale.set(0);
			this.number1.scale.set(0.65);

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
		} 
		//else if(this.player.x - Math.abs(this.player.width/2) < game.camera.x && !this.player.body.blocked.left && this.player.facing === "LEFT") {
		// 	// move camera, then player
		// 	game.camera.x -= game.width;
		// 	this.player.x = game.camera.x + game.width - Math.abs(this.player.width/2);	
		// } 
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
	this.gearInstructions.visible = false;
	this.platformInstructions.visible = true;
	this.exitInstructions.visible = true;
}