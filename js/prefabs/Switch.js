// Prefab for any switch mechanics we implement in the game
function Switch(game, key, frame, x, y) {
	// Switch constructor
	Phaser.Sprite.call(this, game, 0, 0, key, frame);
	this.anchor.setTo(0.5, 1);

	// Physics and scale of switch
	game.physics.arcade.enable(this);
	this.scale.x = 0.25;
	this.scale.y = 0.25;
	this.x = x;
	this.y = y;

}

Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
	// if(this.body.blocked.top) {
	// 	console.log(pressed);
	// }
}