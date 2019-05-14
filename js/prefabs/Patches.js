// Prefab for our player character, Patches
function Patches(game, frame, x, y) {
	// Player constructor
	Phaser.Sprite.call(this, game, 0, 0, frame);
	this.anchor.set(0.5,0.5);
	this.facing = "RIGHT";
	this.scale.set(0.75);

	// Define some constants for character movement
	this.MAX_X_VELOCITY = 500;	// measured in pixels/second
	this.MAX_Y_VELOCITY = 5000;
	this.DRAG = 600;			// note that DRAG < ACCELERATION (to create sliding)
	this.GRAVITY = 1500;
	this.JUMP_SPEED = -630;	// negative y-values jump up

	// Adjust physics properties for the player
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.x = x;
	this.y = y;
	this.body.gravity.y = this.GRAVITY;
	this.body.bounce.set(0.3);
	this.body.maxVelocity.x = this.MAX_X_VELOCITY;
	this.body.maxVelocity.y = this.MAX_Y_VELOCITY;
	this.body.drag.setTo(this.DRAG, 0);
}

Patches.prototype = Object.create(Phaser.Sprite.prototype);
Patches.prototype.constructor = Patches;

Patches.prototype.update = function() {
	//game.debug.body(this);

	// Enable Phaser's Keyboard Manager
	this.cursors = game.input.keyboard.createCursorKeys();

 	// If nothing pressed, velocity = 0
 	this.body.velocity.x = 0;

 	// Move left and right with arrow keys
 	if(this.cursors.left.isDown) {
		this.body.velocity.x = -300; // Move left
		// this.player.animations.play('left');
		this.facing = "LEFT";
	}

	else if(this.cursors.right.isDown) {
		this.body.velocity.x = 300; // Move right
		// this.player.animations.play('right');
		this.facing = "RIGHT";
	}

	else { // Stand "still"
		this.body.velocity.x = 0;
		// this.player.animations.stop();
		if(this.facing == 'RIGHT') {
			// this.player.animations.play('idleRight');
		}
		else {
			// this.player.animations.play('idleLeft');
		}
	}

	// Jump if the player is grounded
	if(this.cursors.up.isDown && this.body.touching.down){
		this.body.velocity.y = this.JUMP_SPEED;
		// this.player.animations.play('jump');
	}
}