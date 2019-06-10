// Prefab for music box generated PauseMenus in the self.game
function PauseMenu(game) {
	// Constructor for music PauseMenus
	Phaser.Group.call(this, game);

	// Set size and lifetime of PauseMenus
	// this.anchor.set(0.5);
	// this.scale.y = 0.33;
	// this.scale.x = 0.33;
	// this.x = x;
	// this.y = y;

	this.pauseMenuButton = self.game.add.button(750, 50, 'pausemenu', this.openMenu, this, 'pause-button', 'pause-button', 'pause-button', 'pause-button');
		this.pauseMenuButton.anchor.set(0.5);
		this.pauseMenuButton.scale.set(0.25);
		this.pauseMenuButton.alpha = 1;
		this.pauseMenuButton.fixedToCamera = true;
		// this.pauseMenuOpen = false;

		this.menuBg = self.game.add.sprite(400, 300, 'pausemenu', 'menu-bg');
		this.menuBg.anchor.set(0.5);
		this.menuBg.scale.setTo(5, 3.5);
		this.menuBg.alpha = 0;
		this.menuBg.fixedToCamera = true;

		this.pauseText = self.game.add.sprite(400, 160, 'pausemenu', 'paused');
		this.pauseText.anchor.set(0.5);
		this.pauseText.scale.set(0.6);
		this.pauseText.alpha = 0;
		this.pauseText.fixedToCamera = true;

		this.resumeButton = self.game.add.button(250, 300, 'pausemenu', this.closeMenu, this, 'resume', 'resume', 'resume', 'resume');
		this.resumeButton.anchor.set(0.5);
		this.resumeButton.alpha = 0;
		this.resumeButton.fixedToCamera = true;

		this.mainMenuButton = self.game.add.button(250, 450, 'pausemenu', this.goToMainMenu, this, 'mainmenu', 'mainmenu', 'mainmenu', 'mainmenu');
		this.mainMenuButton.anchor.set(0.5);
		this.mainMenuButton.alpha = 0;
		this.mainMenuButton.fixedToCamera = true;

		this.restartLevelButton = self.game.add.button(550, 300, 'pausemenu', this.restartLevel, this, 'restart', 'restart', 'restart', 'restart');
		this.restartLevelButton.anchor.set(0.5);
		this.restartLevelButton.alpha = 0;
		this.restartLevelButton.fixedToCamera = true;

		this.skipLevelButton = self.game.add.button(550, 450, 'pausemenu', this.skipLevel, this, 'skip', 'skip', 'skip', 'skip');
		this.skipLevelButton.anchor.set(0.5);
		this.skipLevelButton.alpha = 0;
		this.skipLevelButton.fixedToCamera = true;
}

PauseMenu.prototype = Object.create(Phaser.Group.prototype);
PauseMenu.prototype.constructor = PauseMenu;

PauseMenu.prototype.update = function() {
	if(self.pauseMenuOpen) {
			this.menuBg.alpha = 1;
			this.pauseText.alpha = 1;
			this.resumeButton.alpha = 1;
			this.mainMenuButton.alpha = 1;
			this.restartLevelButton.alpha = 1;
			this.skipLevelButton.alpha = 1;

			this.resumeButton.inputEnabled = true;
			this.mainMenuButton.inputEnabled = true;
			this.restartLevelButton.inputEnabled = true;
			this.skipLevelButton.inputEnabled = true;

			// self.pauseOpen = true;	// stop player movement
		}
		else {
			this.menuBg.alpha = 0;
			this.pauseText.alpha = 0;
			this.resumeButton.alpha = 0;
			this.mainMenuButton.alpha = 0;
			this.restartLevelButton.alpha = 0;
			this.skipLevelButton.alpha = 0;

			this.resumeButton.inputEnabled = false;
			this.mainMenuButton.inputEnabled = false;
			this.restartLevelButton.inputEnabled = false;
			this.skipLevelButton.inputEnabled = false;

			// self.pauseOpen = false;	// allow player movement
		}
},

PauseMenu.prototype.openMenu = function() {
	self.openMenu();
},

PauseMenu.prototype.closeMenu = function() {
	self.closeMenu();
},

PauseMenu.prototype.gotToMainMenu = function() {
	self.goToMainMenu();
},

PauseMenu.prototype.restartLevel = function() {
	self.restartLevel();
},

PauseMenu.prototype.skipLevel = function() {
	self.skipLevel();
}