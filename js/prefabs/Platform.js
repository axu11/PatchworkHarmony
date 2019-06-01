// Prefab for music box generated platforms in the game
function Platform(game, key, frame, x, y, levelScale) {
	// Constructor for music platforms
	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	// Set size and lifetime of platforms
	this.anchor.set(0.5);
	this.scale.y = 0.1 * levelScale;
	this.scale.x = 0.1 * levelScale;
	this.x = x;
	this.y = y;
	this.lifetime = 200;
	this.decaying = true;
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
	if(this.decaying) {
		this.lifetime -= 2;
		this.alpha = this.lifetime/200;
	}

	// if the platform is carrying the dropped platform, it will not disappear
	if(self.carryDroppedPlatform) {
		this.decaying = false;
	}
	else {
		this.decaying = true;
	}
	// After some time, destroy the platform and enable player to create another
	if(this.lifetime <= 0 ) {
		this.destroy();
		reloadOnGround++;
	}
}