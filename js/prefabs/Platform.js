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
	this.lifetime = 300;
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