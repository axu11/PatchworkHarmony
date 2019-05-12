var Play = function(game) {
	// define constants
	this.HALFSCALE = 0.5;
	this.MAX_X_VELOCITY = 500;	// measured in pixels/second
	this.MAX_Y_VELOCITY = 5000;
	this.ACCELERATION = 1500;
	this.DRAG = 600;			// note that DRAG < ACCELERATION (to create sliding)
	this.GRAVITY = 2600;
	this.JUMP_SPEED = -700;	// negative y-values jump up

	// define other variables
	this.numPlatforms = 0;
};
Play.prototype = {
	create: function() {
		// create background, set bounds to image resolution
		this.bg = game.add.image(0, 0, 'bg');
		game.world.setBounds(0, 0, this.bg.width, this.bg.height);
		
		// create player
		this.players = game.add.group();
		this.player = new Patches(game, 'patches', 100, 400);
		this.player.enableBody = true;
		this.players.add(this.player);
		
		// set up world physics
		// game.physics.startSystem(Phaser.Physics.ARCADE);
		// game.physics.arcade.gravity.y = this.GRAVITY;
		// this.player.animations.add('right', Phaser.Animation.generateFrameNames('furretWalk', 1, 4, '', 4), 10, true);
		// this.player.animations.add('left', Phaser.Animation.generateFrameNames('furretWalk', 5, 8, '', 4), 10, true);
		// this.player.animations.add('idleRight', ['furretWalk0001'], 30, false);
		// this.player.animations.add('idleLeft', ['furretWalk0005'], 30, false);
	
		// create box
		this.box = game.add.sprite(350, 250, 'box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.75);
		this.box.body.collideWorldBounds = true;
		this.box.body.gravity.y = 300;
		this.box.body.drag = 0.5;
		//this.box.body.setSize(57, 50, 15, 15);
		this.attached = false;
		// this.box.body.immovable = true;

		platforms = game.add.group();
		// game.physics.arcade.enable(platforms);
		platforms.enableBody = true;
		// platforms.body.immovable = true;

		this.ground = platforms.create(-64, 500, 'atlas', 'sky');
		this.ground.scale.setTo(13, 1);
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		this.ground.body.allowGravity = false;

		this.switches = game.add.group();
		this.switches.enableBody = true;
		this.switch = new Switch(game, 'atlas', 'apple', 250, 500);
		this.switches.add(this.switch);
		this.switch.body.immovable = true;
		this.switch.scale.setTo(2.0, 0.5);
		this.switch.body.allowGravity = false;

		this.activatedPlatformStartX = 290;
		this.activatedPlatform = platforms.create(this.activatedPlatformStartX, 220, 'atlas', 'sky');
		this.activatedPlatform.scale.setTo(1.5, 0.25);
		this.activatedPlatform.angle += 270
		game.physics.arcade.enable(this.activatedPlatform);
		this.activatedPlatform.body.immovable = true;
		this.activatedPlatform.body.allowGravity = false;

	},
	update: function() {
		//game.debug.body(this.box);
		// game.debug.body(this.ground);

		// console.log(this.player.facing);
		this.checkCamBounds();
		// enable player collision
		this.hitPlatform = game.physics.arcade.collide(this.player, platforms);
		this.hitPlatformBox = game.physics.arcade.collide(this.box, platforms);
		this.hitBox = game.physics.arcade.collide(this.player, this.box);
		this.hitSwitch = game.physics.arcade.collide(this.player, this.switches);
		this.boxHitSwitch = game.physics.arcade.collide(this.box, this.switches);

		// box does't glide when pushed
		this.box.body.velocity.x = 0;

		
		// switch logic for player on switch
		if(this.hitSwitch && this.player.y + this.player.height/2 < this.switch.y - this.switch.height) {	// if colliding with top of switch
			console.log('pressed');
			this.playerOnSwitch = true;
			this.switchPressed = true;
		}
		if(this.playerOnSwitch && !this.hitSwitch && (this.player.x + this.player.width/2 < this.switch.x - this.switch.width/2 || this.player.x - this.player.width/2 > this.switch.x + this.switch.width/2))  {
			this.playerOnSwitch = false;
			this.switchPressed = false;
		}
		// switch logic for box on switch
		if(this.boxHitSwitch && this.box.y + this.box.height/2 < this.switch.y - this.switch.height) {
			console.log('pressed');
			this.boxOnSwitch = true;
			this.switchPressed = true;
		}
		if(this.boxOnSwitch && !this.boxHitSwitch && (this.box.x + this.box.width/2 < this.switch.x - this.switch.width/2 || this.box.x - this.box.width/2 > this.switch.x + this.switch.width/2)) {
			this.boxOnSwitch = false;
			this.switchPressed = false;
		}

		// when switch is pressed, it goes down
		if(this.switchPressed) {
			if(this.switch.scale.y > 0) {
				this.switch.scale.setTo(2, this.switch.scale.y - 0.01);
			}
		}
		else {
			if(this.switch.scale.y < 0.25) {
				this.switch.scale.setTo(2, this.switch.scale.y + 0.01);
			}
		}
		/*
		// switch activation consequnce
		if(this.switchPressed) {
			if(this.activatedPlatform.x < 0) {
				this.activatedPlatform.x += 5;
			}
		}
		else{
			if(this.activatedPlatform.x > this.activatedPlatformStartX) {
				this.activatedPlatform.x -= 5;
			}
		}*/
		if(this.switchPressed) {
			if(this.activatedPlatform.angle != 0){
				this.activatedPlatform.angle += 1;
			}
		}
		else{
			if(this.activatedPlatform.angle != 270){
				this.activatedPlatform.angle -= 1;
			}
		}

		// when holding the box
		if(this.attached) {
			if(this.player.facing == "RIGHT") { // when facing right, the box is immediately to the player's right
				this.box.x = this.player.x + this.player.width/2 + this.box.width/2 + 1;
			}
			else{ // when facing left, the box is immediately to the player's left
				this.box.x = this.player.x - this.player.width/2 - this.box.width/2 + 1;	
			}
			this.box.y = this.player.y;	// the box is off the ground
			this.box.body.gravity.y = 0; // box doesn't fall when you're holding it

			// spawn platform
			if(game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).justPressed()) { 
				this.createdPlatform = new Platform(game, ['platform1'/*, 'platform2', 'platform3', 'platform4'*/], this.player.x, this.player.y + this.player.height/2 + 30);
				platforms.add(this.createdPlatform); 
				game.physics.arcade.enable(this.createdPlatform);
				this.createdPlatform.body.immovable = true;
			}

			// drop the box
			if(game.input.keyboard.addKey(Phaser.KeyCode.SHIFT).justPressed()) {
				this.attached = false;
			}
		}
		// when not holding the box
		else {
			this.box.body.gravity.y = 300;	// box falls
			// pick up box from left
			if(game.input.keyboard.addKey(this.player.facing == 'RIGHT' && Phaser.KeyCode.SHIFT).justPressed() && this.hitPlatform && Math.abs((this.player.x + this.player.width/2) - (this.box.x - this.box.width/2)) <= 5) {
				this.attached = true;
			}
			// pick up box from right
			if(game.input.keyboard.addKey(this.player.facing == 'LEFT' && Phaser.KeyCode.SHIFT).justPressed() && this.hitPlatform && Math.abs((this.player.x - this.player.width/2) - (this.box.x + this.box.width/2)) <= 5) {
				this.attached = true;
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