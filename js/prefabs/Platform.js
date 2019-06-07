// Prefab for music box generated platforms in the game
function Platform(game, key, frame, x, y, levelScale) {
	// Constructor for music platforms
	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	// Set size and lifetime of platforms
	this.anchor.set(0.5);
	this.scale.y = 0.5 * levelScale;
	this.scale.x = 0.5 * levelScale;
	this.x = x;
	this.y = y;
	this.lifetime = 200;
	this.decaying = true;
	this.keyLeniency = 20;
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
// if(self = 'Level4') {
	if(this.x >= self.key1.x - this.keyLeniency && this.x <= self.key1.x + this.keyLeniency && this.y >= self.key1.y - this.keyLeniency && this.y <= self.key1.y + this.keyLeniency) {
		console.log('filled 1');
		self.key1Lock = true;
		this.decaying = false;
	}
	else if(this.x >= self.key2.x - this.keyLeniency && this.x <= self.key2.x + this.keyLeniency && this.y >= self.key2.y - this.keyLeniency && this.y <= self.key2.y + this.keyLeniency) {
		console.log('filled 2');
		self.key2Lock = true;
		this.decaying = false;
	}
	else if(this.x >= self.key3.x - this.keyLeniency && this.x <= self.key3.x + this.keyLeniency && this.y >= self.key3.y - this.keyLeniency && this.y <= self.key3.y + this.keyLeniency) {
		console.log('filled 3');
		self.key3Lock = true;
		this.decaying = false;
	}
	else {
		self.key1Lock = false;
		self.key2Lock = false;
		self.key3Lock = false;
	}
// }
	// After some time, destroy the platform and enable player to create another
	if(this.lifetime <= 0 ) {
		this.destroy();
		reloadOnGround++;
	}
}