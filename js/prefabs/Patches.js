// Prefab for our player character, Patches
function Patches(game, key, frame, x, y, levelScale) {
	// Player constructor
	Phaser.Sprite.call(this, game, 0, 0, key, frame);
	this.anchor.set(0.5,0.5);
	this.facing = "RIGHT";
	this.scale.set(0.4);

	// Define some constants for character movement
	this.MAX_X_VELOCITY = 500 * levelScale;	// measured in pixels/second
	this.MAX_Y_VELOCITY = 5000 * levelScale;
	this.DRAG = 600;			// note that DRAG < ACCELERATION (to create sliding)
	this.GRAVITY = 1500 * levelScale;
	this.JUMP_SPEED = -630 * levelScale;	// negative y-values jump up

	// Adjust physics properties for the player
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.x = x;
	this.y = y;
	this.body.gravity.y = this.GRAVITY;
	// this.body.bounce.set(0.3);
	this.VELOCITY_X = 300 * levelScale;
	this.body.maxVelocity.x = this.MAX_X_VELOCITY;
	this.body.maxVelocity.y = this.MAX_Y_VELOCITY;
	this.body.drag.setTo(this.DRAG, 0);
	this.body.setSize(200, 300, 10, 30);

	// Animations
	// this.animations.add('right', Phaser.Animation.generateFrameNames('', 1, 4, '', 4), 10, true);
	// this.animations.add('left', Phaser.Animation.generateFrameNames('', 5, 8, '', 4), 10, true);
	this.animations.add('idleRight', ['patchesAtlas2', 'right1'], 60, false);
	this.animations.add('idleLeft', ['patchesAtlas2', 'left1'], 60, false);
	this.animations.add('moveRight', ['patchesAtlas2', 'right1', 'right2', 'right3'], 4, false);
	this.animations.add('moveLeft', ['patchesAtlas2', 'left1', 'left2', 'left3'], 4, false);
	this.jump = game.add.audio('jump', 0.1, false);

}

Patches.prototype = Object.create(Phaser.Sprite.prototype);
Patches.prototype.constructor = Patches;

Patches.prototype.update = function() {
	game.debug.body(this);

	// Enable Phaser's Keyboard Manager
	this.cursors = game.input.keyboard.createCursorKeys();

 	// If nothing pressed, velocity = 0
 	this.body.velocity.x = 0;

 	// Move left and right with arrow keys
 	if(this.cursors.left.isDown) {
		this.body.velocity.x = -this.VELOCITY_X; // Move left
		// this.player.animations.play('left');
		this.animations.play('moveLeft');
		this.facing = "LEFT";
	}

	else if(this.cursors.right.isDown) {
		this.body.velocity.x = this.VELOCITY_X; // Move right
		// this.player.animations.play('right');
		this.animations.play('moveRight');
		this.facing = "RIGHT";
	}

	else { // Stand "still"
		this.body.velocity.x = 0;
		// this.player.animations.stop();
		if(this.facing == 'RIGHT') {
			this.animations.play('idleRight');
		}
		else {
			this.animations.play('idleLeft');
		}
	}

	// Jump if the player is grounded
	if(this.cursors.up.isDown && this.body.touching.down){
		this.body.velocity.y = this.JUMP_SPEED;
		this.jump.play();
		// this.player.animations.play('jump');
	}
}