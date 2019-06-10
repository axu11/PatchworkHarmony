// Prefab for Pause Menu
function PauseMenu(game, key, frame, x, y, state) {
	// Constructor for music PauseMenus
	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	// Set size and lifetime of PauseMenus
	this.anchor.set(0.5);
	this.scale.y = 0.33;
	this.scale.x = 0.33;
	this.x = x;
	this.y = y;
	this.state = state;
	this.menuIsOpen = false;

	this.menu = game.add.sprite(game.camera.x + 400, game.camera.y + 300, 'atlas', 'red');
	// this.menuButton = game.add.button(this.x, this.y, 'assets', 'gear', openMenu, this);
}

PauseMenu.prototype = Object.create(Phaser.Sprite.prototype);
PauseMenu.prototype.constructor = PauseMenu;

PauseMenu.prototype.update = function() {
	
}

function openMenu() {
	this.menu.alpha = 1;
	this.pause.alpha = 1;
	this.mainMenuButton.alpha = 1;
	this.resumeButton.alpha = 1;
	this.restartLevel.alpha = 1;
	this.skipLevel.alpha = 1;
}