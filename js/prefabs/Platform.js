// Prefab for music box generated platforms in the game
function Platform(game, frame, x, y) {
	// Constructor for music platforms
	Phaser.Sprite.call(this, game, 0, 0, frame);

	// Set size and lifetime of platforms
	this.anchor.set(0.5);
	this.scale.y = 0.1;
	this.scale.x = 0.1;
	this.x = x;
	this.y = y;
	this.lifetime = 100;
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
	this.lifetime -= 2;

	// After some time, destroy the platform and enable player to create another
	if(this.lifetime <= 0 ) {
		this.destroy();
		numPlatforms++;
	}
	//game.debug.body(this);
}