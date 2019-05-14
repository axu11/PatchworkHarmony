// Load state preloads all assets used in the game
var Load = function(game) {};
Load.prototype = {
	
	preload: function() {
		// Setup loading bar
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		// Load all assets, beginning with images and spritesheets, then audio
		this.load.path = 'assets/';
		game.load.image('bg', 'img/bg.jpg');
		game.load.image('box', 'img/box.png');
		game.load.image('patches', 'img/patches.png');
		game.load.image('bg1', 'img/bg-lvl-1.png');
		game.load.image('shelf', 'img/shelf-platform.png');
		game.load.image('window', 'img/window.png');
		game.load.image('platform1', 'img/Platform-1.png');
		game.load.image('platform2', 'img/Platform-2.png');
		game.load.image('platform3', 'img/Platform-3.png');
		game.load.image('platform4', 'img/Platform-4.png');
		this.load.atlas('atlas', 'img/spritesheet.png', 'img/sprites.json');
		this.load.atlas('numbers', 'img/numbersheet.png', 'img/numbers.json');

		game.load.audio('bgm', 'audio/bg-loop-temp.ogg');
		game.load.audio('platform1audio', 'audio/platform-1.ogg');
		game.load.audio('platform2audio', 'audio/platform-2.ogg');
		game.load.audio('platform3audio', 'audio/platform-3.ogg');
		game.load.audio('platform4audio', 'audio/platform-4.ogg');
		
	},

	create: function() {
		// Check for local storage browser support
		if(window.localStorage) {
			console.log('Local storage supported');
		} else {
			console.log('Local storage not supported');
		}

		// Go to MainMenu state
		game.state.start('MainMenu');
	}
};
