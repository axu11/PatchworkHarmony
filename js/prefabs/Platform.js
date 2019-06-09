// Prefab for music box generated platforms in the game
function Platform(game, key, frame, x, y, levelScale) {
	// Constructor for music platforms
	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	// Set size and lifetime of platforms
	this.anchor.set(0.5);
	this.scale.y = 0.33 * levelScale;
	this.scale.x = 0.33 * levelScale;
	this.x = x;
	this.y = y;
	this.lifetime = 200;
	this.decaying = true;
	this.keyLeniency = 20;
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
	this.carryDroppedPlatform = game.physics.arcade.collide(self.droppedPlatform, this);   // dropped vs  created platforms
	//game.debug.body(this);
	if(this.decaying) {
		this.lifetime -= 2;
		this.alpha = this.lifetime/200;
	}

	// if the platform is carrying the dropped platform, it will not disappear
	if(this.carryDroppedPlatform) {
		this.decaying = false;
	}
	else {
		this.decaying = true;
	}
	
	if((self.level == 4 || self.level == 5) && (!keySolved || !wallShifted)){
		if(this.x >= self.key1.x - this.keyLeniency && this.x <= self.key1.x + this.keyLeniency && this.y >= self.key1.y - this.keyLeniency && this.y <= self.key1.y + this.keyLeniency) {
			//console.log('filled 1');
			self.key1.destroy();
			if(!self.keySolved)
				this.decaying = false;
			else
				this.decaying = true;
		}
		else if(this.x >= self.key2.x - this.keyLeniency && this.x <= self.key2.x + this.keyLeniency && this.y >= self.key2.y - this.keyLeniency && this.y <= self.key2.y + this.keyLeniency) {
			//console.log('filled 2');
			self.key2Lock = true;
			self.key2.destroy();
			if(!self.keySolved)
				this.decaying = false;
			else
				this.decaying = true;
		}
		else if(this.x >= self.key3.x - this.keyLeniency && this.x <= self.key3.x + this.keyLeniency && this.y >= self.key3.y - this.keyLeniency && this.y <= self.key3.y + this.keyLeniency) {
			//console.log('filled 3');
			self.key3Lock = true;
			self.key3.destroy();
			if(!self.keySolved)
				this.decaying = false;
			else
				this.decaying = true;
		}
		else {
			self.key1Lock = false;
			self.key2Lock = false;
			self.key3Lock = false;
		}
	}
	
	// After some time, destroy the platform and enable player to create another
	if(this.lifetime <= 0 ) {
		this.destroy();
		reloadOnGround++;
	}
}