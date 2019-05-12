var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// setup loading bar
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		this.load.path = 'assets/';
		game.load.image('bg', 'img/bg.jpg');
		game.load.image('box', 'img/box.png');
		game.load.image('patches', 'img/patches.png');
		game.load.image('platform1', 'img/Platform-1.png');
		game.load.image('platform2', 'img/Platform-2.png');
		game.load.image('platform3', 'img/Platform-3.png');
		game.load.image('platform4', 'img/Platform-4.png');
		this.load.atlas('atlas', 'img/spritesheet.png', 'img/sprites.json');
	},

	create: function() {
		// check for local storage browser support
		if(window.localStorage) {
			console.log('Local storage supported');
		} else {
			console.log('Local storage not supported');
		}
		// go to Title state
		game.state.start('MainMenu');
	}
};
