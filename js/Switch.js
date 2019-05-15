function Switch(game, key, frame, x, y) {
	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	this.anchor.setTo(0.5, 1);
	this.scale.x = 0.25;
	this.scale.y = 0.25;
	this.x = x;
	this.y = y;
	game.physics.arcade.enable(this);
	// this.ground.body.immovable = true;
}

Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
	// if(this.body.blocked.top) {
	// 	console.log(pressed);
	// }
}