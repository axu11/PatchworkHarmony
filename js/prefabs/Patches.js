function Patches(game, frame, x, y) {
	Phaser.Sprite.call(this, game, 0, 0, frame);

	this.anchor.set(0.5,0.5);
	this.facing = "RIGHT";

// define constants
	this.HALFSCALE = 0.5;
	this.MAX_X_VELOCITY = 500;	// measured in pixels/second
	this.MAX_Y_VELOCITY = 5000;
	this.ACCELERATION = 1500;
	this.DRAG = 600;			// note that DRAG < ACCELERATION (to create sliding)
	this.GRAVITY = 1500;
	this.JUMP_SPEED = -630;	// negative y-values jump up
	// adjust physics properties for the player
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.x = x;
	this.y = y;
	this.body.gravity.y = this.GRAVITY;
	this.body.bounce.set(0.3);
	this.body.maxVelocity.x = this.MAX_X_VELOCITY;
	this.body.maxVelocity.y = this.MAX_Y_VELOCITY;
	this.body.drag.setTo(this.DRAG, 0);
	this.scale.setTo(0.75, 0.75);

}



Patches.prototype = Object.create(Phaser.Sprite.prototype);
Patches.prototype.constructor = Patches;

Patches.prototype.update = function() {
	game.debug.body(this);
	// enable Phaser's Keyboard Manager
	this.cursors = game.input.keyboard.createCursorKeys();

 	// if nothing pressed, velocity = 0
 	this.body.velocity.x = 0;
 	//move left and right, slowed as belly gets low
 	if(this.cursors.left.isDown) {
		// move left
		this.body.velocity.x = -300;
		// this.player.animations.play('left');
		
		this.facing = "LEFT";

	}
	else if(this.cursors.right.isDown) {
		// move right
		this.body.velocity.x = 300;
		// this.player.animations.play('right');
		
		this.facing = "RIGHT";
	}
	else { // stand "still"
		this.body.velocity.x = 0;
		// this.player.animations.stop();
		if(this.facing == 'RIGHT') {
			// this.player.animations.play('idleRight');
		}
		else {
			// this.player.animations.play('idleLeft');
		}
	}

	// jump if the player is grounded
	if(this.cursors.up.isDown && this.body.touching.down){//} || (this.hitPlatform || this.hitBox || this.hitSwitch)) {
		this.body.velocity.y = this.JUMP_SPEED;
		// this.player.animations.play('jump');
	}
}