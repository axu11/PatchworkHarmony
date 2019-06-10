// First level state for the game, shows our tutorial and core mechanics
var Play = function(game) {};
Play.prototype = {

	init: function(bgmOn, numPlatforms, reloadOnGround) {
		this.reloadOnGround = reloadOnGround;	
		self = this;

		this.level = 1;						// current level is 1
		this.levelScale = 1.0;				// levelScale that affects the sizing of assets in prefabs
		this.numPlatforms = numPlatforms;	// current platforms set to maxPlatforms
		this.bgmOn = bgmOn;

		this.cutscenePlaying = true;    	// starts off true because tutorial instructions pop up

		this.hasFirstGear = false;			// true after inBox() called, used in boxscene
		this.playedBoxScene	= false;		// true after done playing box scene 

		this.canCreate = false;				// usually set to true, used primarily in timers so you don't make a block as you exit a scene
		this.currentInstruction = 1;		// number from 1 to 5, one for each instruction bubble, ends at 6 to indicate no more bubbles
		
		this.timer = 0;						// timer for cutscenes, ticks up 
		this.TIMER_VALUE = 60;				// modify this here depending on how long the delay should be before spacebar can be pressed
	
		this.platformAdded = false;
		this.pauseMenuOpen = false;
	},
	
	create: function() {
		/***** BG, BGM, AND SOUND EFFECTS *****/
		// Create backgrounds for both scenes, set bounds to include both bg (1600 x 600)
		this.bg0 = game.add.image(0, 0, 'bg0');
		this.bg0.alpha = 0;	
		this.bg1 = game.add.image(800, 0, 'bg1');
		game.world.setBounds(0, 0, this.bg0.width + 800, this.bg0.height);

		// Create bgm for level 1, looped and played
		if(this.bgmOn == false) {
			this.bgm = game.add.audio('lvl1', 0.25, true);
			this.bgm.play();
			this.bgmOn = true;
		}

		// Create menu sfx
		this.optionsOpen = game.add.audio('options-open', 0.5, false);
		this.optionsClose = game.add.audio('options-close', 0.5, false);

		// Create sound effect for pickup/drop item
		this.pickup = game.add.audio('pickup', 0.5, false);
		this.drop = game.add.audio('drop', 0.5, false);

		// Create sound effect for moving to next screen
		this.doorClose = game.add.audio('door', 1, false);

		// Create sound effects for when a music block platform is created
		this.platform1audio = game.add.audio('platform1audio', 0.5, false);
		this.platform2audio = game.add.audio('platform2audio', 0.5, false);
		this.platform3audio = game.add.audio('platform3audio', 0.5, false);
		this.platform4audio = game.add.audio('platform4audio', 0.5, false);

		// Creates sound effect for gear collection
		this.gearAudio = game.add.audio('collect-gear', 0.25, false);	

		// Create number circle at top left of screen to indicate this.platforms remaining
		this.numberPosition = 16;
		this.number0 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number0');
		this.number0.scale.set(0.65);
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

		/***** SWITCH MECHANIC *****/
		this.switches = game.add.group();
		this.switches.enableBody = true;

		// Creates the button for the switch (scene 2)
		this.switch = new Switch(game, 'assets', 'switch-button', 1250, 525); 
		this.switches.add(this.switch);
		this.switch.body.immovable = true;
		this.switch.scale.setTo(0.2, 0.25);

		// Creates a window for player to get to in order to clear level
		this.window = game.add.sprite(1320, 70, 'windowAni', 'window0');
		this.window.scale.setTo(0.5, 0.5);
		this.window.animations.add('windowBillow', Phaser.Animation.generateFrameNames('windowAni', 'window', 0, 2), 4, true);
		this.window.animations.play('windowBillow');	
		
		/***** PLATFORMS *****/
		// Create this.platforms group for general platform collision (usually invisible)
		this.platforms = game.add.group();
		this.platforms.enableBody = true;

		//Create createdPlatforms group for music blocks
		this.createdPlatforms = game.add.group();
		this.createdPlatforms.enableBody = true;

		this.instructions = game.add.group();
		this.instructions.enableBody = true;

		// Create invisible ground platform for player to stand on (both scenes)
		this.ground = this.platforms.create(-64, 550, 'atlas', 'sky'); 
		this.ground.scale.setTo(13, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.visible = false;

		// Create invisible wall preventing player from returning to first screen (scene 1)
		this.wall = this.platforms.create(780, 0, 'atlas', 'sky');
		this.wall.scale.setTo(0.3,10);
		game.physics.arcade.enable(this.wall);
		this.wall.body.immovable = true;
		this.wall.alpha = 0;

		// Creates invisible platform on top of desk (scene 1)
		this.desk = this.platforms.create(30, 400, 'atlas', 'sky');
		this.desk.scale.setTo(1.20, 1);
		game.physics.arcade.enable(this.desk);
		this.desk.body.immovable = true;
		this.desk.alpha = 0;
		this.desk.body.checkCollision.down = false;
		this.desk.body.checkCollision.left = false;
		this.desk.body.checkCollision.right = false;

		// Create invisible platform on top of drawer, only collides on top (scene 2)
		this.drawer = this.platforms.create(1020, 410, 'atlas','sky');
		game.physics.arcade.enable(this.drawer);
		this.drawer.scale.setTo(0.65, 0.075);
		this.drawer.body.immovable = true;
		this.drawer.body.checkCollision.down = false;
		this.drawer.body.checkCollision.left = false;
		this.drawer.body.checkCollision.right = false;
		this.drawer.alpha = 0;

		// Create invisible platform on top of table, only collides on top (scene 2)
		this.table = this.platforms.create(820, 430, 'atlas','sky');
		game.physics.arcade.enable(this.drawer);
		this.table.scale.setTo(1.35, 0.075);
		this.table.body.immovable = true;
		this.table.body.checkCollision.down = false;
		this.table.body.checkCollision.left = false;
		this.table.body.checkCollision.right = false;
		this.table.alpha = 0;

		// Create platform right below window (scene 2)
		this.shelf = this.platforms.create(1470, 240, 'assets', 'shelf-platform');
		this.shelf.anchor.set(0.5);
		this.shelf.scale.setTo(0.6, 0.4);
		this.shelf.body.immovable = true;

		// Creates a visible platform that lowers once switch is activated (scene 2)
		this.activatedPlatform = this.platforms.create(800, 300, 'assets', 'shelf-platform');
		this.activatedPlatform.scale.set(0.55);
		this.activatedPlatform.angle += 270;  // activated platform starts rotated up
		this.activatedPlatformXSize = 10;
		this.activatedPlatformYSize = 1280;
		this.activatedPlatformXOffset = 0;
		this.activatedPlatformYOffset = -1280;
		this.activatedPlatform.body.setSize(this.activatedPlatformXSize, this.activatedPlatformYSize, this.activatedPlatformXOffset, this.activatedPlatformYOffset);   // custom bounding box for the activated platform
		game.physics.arcade.enable(this.activatedPlatform);
		this.activatedPlatform.body.immovable = true;

		// Creates a collectible "gear" that will enable player to unlock an ability (scene 2)
		this.gear = game.add.sprite(920, 95, 'assets', 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.scale.setTo(0.5, 0.5);	
		this.gear.anchor.set(0.5, 0.5);

		// Creates a bed for the switch to rest on (scene 2)
		this.switchHolder = game.add.sprite(1250, 525, 'assets', 'switch-holder');
		this.switchHolder.anchor.set(0.5, 1);
		this.platforms.add(this.switchHolder);
		this.switchHolder.scale.setTo(0.2, 0.25);
		this.switchHolder.body.immovable = true;

		/***** PLAYER SPRITE *****/ 
		this.player = new Patches(game, 'patchesAtlas2', 'right1', 76, 332, this.levelScale);
		this.player.enableBody = true;
		this.player.alpha = 0;
		game.add.existing(this.player);
		
		/***** MUSIC BOX *****/
		this.box = game.add.sprite(148, 382, 'assets', 'box');
		game.physics.arcade.enable(this.box);
		this.box.alpha = 0;
		this.box.anchor.set(0.50);
		this.box.scale.set(0.2);
		this.box.body.collideWorldBounds = true;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = false; 	// Initially not picked up by player

		/***** INSTRUCTIONS AND CUTSCENES *****/		
		// Box animation cutscene
		this.boxScene = game.add.sprite(800, 0, 'boxscene', 'cutscene1');
		this.boxScene.visible = false;
		this.boxScene.animations.add('boxscene', Phaser.Animation.generateFrameNames('boxscene', 'cutscene', 1, 4), 4, true);
		this.boxScene.animations.play('boxscene');

		// Instructions played in the tutorial
		this.instructions5 = game.add.sprite(this.player.x, this.player.y, 'instructions', 'bubble4');	// spacebar to create block	
		this.instructions4 = this.instructions.create(880, 200, 'instructions', 'bubble3');			// gear with question mark
		this.instructions3 = this.instructions.create(880, 200, 'instructions', 'bubble2');			// arrow pointing towards window
		this.instructions2 = this.instructions.create(100, 75, 'instructions', 'bubble1');			// patches bringing box to lindsey
		this.instructions1 = this.instructions.create(100, 75, 'instructions', 'bubble'); 			// arrow keys and shift
		this.instructions4.alpha = 0;
		this.instructions3.alpha = 0;
		this.instructions2.alpha = 0;
		this.instructions1.alpha = 0;
		this.instructions5.alpha = 0;

		// Spacebar indicators for instructions 1 and 2
		this.spacebar = game.add.sprite(320, 300, 'instructions', 'spacebar1'); 
		this.spacebar.scale.setTo(0.33);
		this.spacebar.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 1, 3), 4, true);
		this.spacebar.animations.play('spacebarAni');
		this.spacebar.alpha = 0;

		// Spacebar indicators for instructions 3 and 4
		this.spacebar2 = game.add.sprite(1100, 400, 'instructions', 'spacebar1'); 
		this.spacebar2.scale.setTo(0.33);
		this.spacebar2.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 1, 3), 4, true);
		this.spacebar2.animations.play('spacebarAni');
		this.spacebar2.alpha = 0;

		// Spacebar indicator for instructions 5
		this.spacebar3 = game.add.sprite(this.player.x, this.player.y, 'instructions', 'spacebar1'); 
		this.spacebar3.scale.setTo(0.33);
		this.spacebar3.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 1, 3), 4, true);
		this.spacebar3.animations.play('spacebarAni');
		this.spacebar3.alpha = 0;

		// Spacebar indicator for box cutscene
		this.spacebar4 = game.add.sprite(1450, 550, 'instructions', 'spacebar1'); 
		this.spacebar4.scale.setTo(0.33);
		this.spacebar4.animations.add('spacebarAni', Phaser.Animation.generateFrameNames('spacebar', 1, 3), 4, true);
		this.spacebar4.animations.play('spacebarAni');
		this.spacebar4.alpha = 0;

		// Down arrow indicator for exiting through window
		this.downArrow = game.add.sprite(1440, 20, 'instructions', 'down1');
		this.downArrow.scale.setTo(0.33);
		this.downArrow.animations.add('arrowAni', Phaser.Animation.generateFrameNames('down', 1, 4), 4, true);
		this.downArrow.animations.play('arrowAni');
		this.downArrow.alpha = 0;

		this.pauseMenu = new PauseMenu(game);
	},

	update: function() {
		// console.log('play: ' + this.pauseMenuOpen);
		/***** COLLISIONS *****/
		this.hitPlatform = game.physics.arcade.collide(this.player, this.platforms);   				// player vs platforms
		this.hitCreatedPlatform = game.physics.arcade.collide(this.player, this.createdPlatforms); 	// player vs created platforms
		this.hitBox = game.physics.arcade.collide(this.player, this.box);         					// player vs box
		this.hitSwitch = game.physics.arcade.collide(this.player, this.switches); 					// player vs switch
		this.hitPlatformBox = game.physics.arcade.collide(this.box, this.platforms); 			    // box vs platforms
		this.boxHitSwitch = game.physics.arcade.collide(this.box, this.switches); 					// box vs switch
		game.physics.arcade.overlap(this.player, this.gear, this.collectFirstGear, null, this);			// player vs gear, call collectFirstGear
		game.physics.arcade.overlap(this.gear, this.box, this.inBox, null, this);						// gear vs box, call inBox

		/***** CAMERA, TRANSITIONS, AND CUTSCENES *****/
		this.checkCamBounds(); // Keep checking camera bounds
		// Fade in bg, player, box, and instructions
		if(this.bg0.alpha < 1){
        	this.bg0.alpha += 0.01;
        	this.player.alpha += 0.01;
        	this.box.alpha += 0.01;
        	this.instructions1.alpha += 0.01;
        	this.timer = 0;
        }

   		// When player gets to the window, go to level 2 (town scene 1)
		if(this.player.overlap(this.window) && game.input.keyboard.addKey(Phaser.KeyCode.DOWN).justPressed() && this.player.body.touching.down){
			this.cutscenePlaying = true;
			game.camera.fade(0x000000, 3000);
			game.time.events.add(Phaser.Timer.SECOND * 3.0, this.transitionToRooftops, this);
		}

		// Down arrow shows when player approaches window
	    if(this.player.overlap(this.window))
	    	this.downArrow.alpha = 1;
	    else
	   		this.downArrow.alpha = 0;

		// Animate Gear
		this.gear.angle += 1;

		// When you collect the gear, but has yet to finish flying into the box
		if(this.numPlatforms > 0 && !this.hasFirstGear){
			if(this.gear.x < this.box.x)
				this.gear.x += 5;
			if(this.gear.y < this.box.y)
				this.gear.y += 5;
			game.camera.flash(0xffffff, 1000);	// 1000ms flash effect
		}

		// Can't go to scene 2 if not carrying box
		if(this.attached)
			this.wall.body.checkCollision.left = false;
		else
			this.wall.body.checkCollision.left = true;

		// Code for exiting away from the boxscene
		if(this.cutscenePlaying && this.hasFirstGear){
			this.timer++;
			
			// If this.timer passed the spacebar delay, show the spacebar
			if(this.timer >= this.TIMER_VALUE)
				this.spacebar4.alpha = 1;

			// If spacebar showing and you press space, player can now move, cutscene killed, spacebar killed
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.timer >= this.TIMER_VALUE) {
				this.boxScene.destroy();
				this.spacebar4.destroy();
				this.playedBoxScene = true;
				this.cutscenePlaying = false;
			}
		}
		console.log(this.timer + ', ' + this.TIMER_VALUE);

		/***** INSTRUCTIONS *****/
		// Instruction code for instructions 1 and 2
		if(this.currentInstruction < 3 && this.player.overlap(this.instructions)){
			this.timer++;

			// If this.timer passed the spacebar delay, show the spacebar
			if(this.timer >= this.TIMER_VALUE)
				this.spacebar.alpha = 1;

			// If spacebar showing and you press space, proceed to second instruction bubble
			if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentInstruction == 1){
				this.instructions1.destroy();
				this.instructions2.alpha = 1;
				this.currentInstruction++;
				this.spacebar.alpha = 0;
				this.timer = 0;
			}

			// If spacebar showing and you press space, player can now move, instructions killed, spacebar killed
			if(this.spacebar.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentInstruction == 2){
				this.instructions2.destroy();
				this.instructions3.alpha = 1;
				this.spacebar.destroy();				
				this.currentInstruction++;		
				this.cutscenePlaying = false;
				this.timer = 0;
			}
		}

		// Instruction code for instructions 3 and 4
		if(this.currentInstruction >= 3 && this.currentInstruction < 5 && this.player.overlap(this.instructions)){
			this.cutscenePlaying = true;
			this.timer++;

			// If this.timer passed the spacebar delay, show the spacebar
			if(this.timer >= (this.TIMER_VALUE - 20))
				this.spacebar2.alpha = 1;

			// If spacebar showing and you press space, proceed to fourth instruction bubble
			if(this.spacebar2.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentInstruction == 3){
				this.instructions3.destroy();
				this.instructions4.alpha = 1;
				this.currentInstruction++;		
				this.spacebar2.alpha = 0;
				this.timer = 0;
			}

			// If spacebar showing and you press space, player can now move, instructions killed, spacebar killed
			if(this.spacebar2.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentInstruction == 4){
				this.instructions4.destroy();
				this.spacebar2.destroy();
				this.currentInstruction++;		
				this.cutscenePlaying = false;
				this.timer = 0;
			}
		}

		// Set position of last instruction and spacebar to be wherever the player is once box picked up
        if(this.attached){
	        this.instructions5.x = 1000;
	        this.instructions5.y = 150;
            this.spacebar3.x = 1200;
	        this.spacebar3.y = 300;
	    }

		// Instruction code for instruction 5		
		if(this.currentInstruction == 5 && this.attached && this.hasFirstGear){
			this.instructions5.alpha = 1;
			this.cutscenePlaying = true;
			this.timer++;

			// If this.timer passed the spacebar delay, show the spacebar
			if(this.timer >= this.TIMER_VALUE)
				this.spacebar3.alpha = 1;

			// If spacebar showing and you press space, player can now move, instructions killed, spacebar killed
			if(this.spacebar3.alpha == 1 && game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.currentInstruction == 5){
				this.instructions5.destroy();
				this.spacebar3.destroy();
				this.currentInstruction++;		
				this.cutscenePlaying = false;
				this.timer = 0;
				game.time.events.add(Phaser.Timer.SECOND, this.allowCreate, this); // enable music block creation only after a second delay
			}
		}		

		/***** SWITCH + ACTIVATED PLATFORM STUFF *****/
		// Switch logic for player pressing down on switch 
		if(this.hitSwitch && this.player.x > this.switch.x - this.switch.width/2 && this.player.x < this.switch.x + this.switch.width/2) {
			this.playerOnSwitch = true;
			this.switchPressed = true;
		}

		if(this.playerOnSwitch && !this.hitSwitch && (this.player.x + this.player.width/2 < this.switch.x - this.switch.width/2 || this.player.x - this.player.width/2 > this.switch.x + this.switch.width/2 || this.player.y + this.player.height/2 < this.switch.y - this.switch.height - 30))  {
			this.playerOnSwitch = false;
		}

		// Switch logic for box pressing down on switch
		if(this.boxHitSwitch && this.box.x + this.box.width/2 > this.switch.x - this.switch.width/2 && this.box.x < this.switch.x + this.switch.width/2) {
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
				if(this.switch.scale.y >= 0.25) {
					this.switchTrigger = game.add.audio('switchTrigger');
					this.switchTrigger.play('', 0, 0.1, false);
				}
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

		// Change platform offset bounding box as it lowers
		this.activatedPlatform.body.setSize(this.activatedPlatformXSize, this.activatedPlatformYSize, this.activatedPlatformXOffset, this.activatedPlatformYOffset); 

		/***** BOX STUFF *****/
		this.box.body.velocity.x = 0; // Box won't glide when pushed by player

		// When holding the box...
		if(this.attached) {
			this.box.body.checkCollision.none = true;
			// Box moves where player is facing
			if(this.player.facing == "RIGHT") 
				this.box.x = this.player.x + this.player.width/2 + this.box.width/2 - 37;
			else 
				this.box.x = this.player.x - this.player.width/2 - this.box.width/2 + 30;

			this.box.y = this.player.y + 17;	 // the box is off the ground and with the player
			this.box.body.gravity.y = 0;         // box doesn't fall when you're holding it

			// Spawn platform directly under by pressing SPACEBAR
			if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed() && this.numPlatforms > 0 && this.canCreate) {
				// Kills all current sounds set to play before playing the music note sounds in order
				game.time.events.removeAll();
				game.time.events.add(Phaser.Timer.SECOND * 0.0, this.platformSound1, this);
				game.time.events.add(Phaser.Timer.SECOND * 0.5, this.platformSound2, this);
				game.time.events.add(Phaser.Timer.SECOND * 1.0, this.platformSound3, this);
				game.time.events.add(Phaser.Timer.SECOND * 1.5, this.platformSound4, this);

				this.createdPlatform = new Platform(game, 'assets', 'music-block', this.player.x, this.player.y + this.player.height/2 + 30, 1);
				this.createdPlatforms.add(this.createdPlatform); 
				game.physics.arcade.enable(this.createdPlatform);
				this.createdPlatform.body.checkCollision.down = false;
				this.createdPlatform.body.checkCollision.left = false;
				this.createdPlatform.body.checkCollision.right = false;
				this.createdPlatform.body.immovable = true;
				this.numPlatforms--;
			}

			// this.numPlatforms doesn't refresh until the player hits the ground
			if(this.reloadOnGround > 0 && this.player.body.touching.down && this.hitPlatform) {
				this.numPlatforms++;
				this.reloadOnGround--;	
			}

			// Drop the box by pressing SHIFT
			if(game.input.keyboard.addKey(Phaser.KeyCode.SHIFT).justPressed() && !this.cutscenePlaying) {
				this.drop.play();
				this.attached = false;
				this.box.body.checkCollision.none = false;
			}
		}

		// When not holding the box...
		else {
			this.box.body.gravity.y = 300;	// Box has gravity, will fall

			// When picked up from left of box...
			if(game.input.keyboard.addKey(this.player.facing == 'RIGHT' && Phaser.KeyCode.SHIFT).justPressed() && !this.cutscenePlaying && this.hitPlatform && Math.abs((this.player.x + this.player.width/2) - (this.box.x - this.box.width/2)) <= 5) {
				this.pickup.play();
				this.attached = true;
			}
			// When picked up from right of box... 
			if(game.input.keyboard.addKey(this.player.facing == 'LEFT' && Phaser.KeyCode.SHIFT).justPressed() && !this.cutscenePlaying && this.hitPlatform && Math.abs((this.player.x - this.player.width/2) - (this.box.x + this.box.width/2)) <= 5) {
				this.pickup.play();
				this.attached = true;
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
	},

	checkCamBounds: function() {
		// some funky, funky logic to check camera bounds for player movement
		if(this.player.x > game.width + game.camera.x && !this.player.body.blocked.right && this.player.facing === "RIGHT") {
			// Play door close sound effect
			this.doorClose.play();

			// Transition to second screen of Level 1
			// move camera, then player
			game.camera.x += game.width;
			this.player.x = game.camera.x + Math.abs(this.player.width/2);	
		} 
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

	// Function for collecting the first gear, updates numplatforms
  	collectFirstGear: function(){
		this.cutscenePlaying = true;
		if(!this.platformAdded) {
			this.numPlatforms++;
			this.platformAdded = true;
		}

	},

	// Function called when gear flies into the box
	inBox: function(){
		this.gearAudio.play();
		this.gear.destroy();
		this.hasFirstGear = true;
		this.boxScene.visible = true;
		this.cutscenePlaying = true;
	},

	// Function for allowing user to create music note blocks, used to pause music note creation during cutscenes via delay
	allowCreate: function(){
		this.canCreate = true;
	},

	// Function for disabling cutscenePlaying, which was preventing movement
	stopCutscene: function(){
		this.cutscenePlaying = false;
	},

	// Function called to transition to next level and kill bgm
	transitionToRooftops: function(){
		game.state.start('Level2', true, false, false, this.numPlatforms, this.reloadOnGround);
		this.bgm.destroy();
	},

	openMenu: function() {
		this.optionsOpen.play();
		this.pauseMenuOpen = true;
	},

	closeMenu: function() {
		this.optionsClose.play();
		this.pauseMenuOpen = false;
	},

	goToMainMenu: function() {
		game.state.start('MainMenu');
	},

	restartLevel: function() {
		game.state.start('Play', true, false, this.bgmOn, 0, 0);
	},

	skipLevel: function() {
		this.bgm.destroy();
		game.state.start('Level2', true, false, false, 1, 0);
	}
}
