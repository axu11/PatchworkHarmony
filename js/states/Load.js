//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Indie Flower']
    }

};

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
		// game.load.image('box', 'img/box.png');
		// game.load.image('patches', 'img/patches.png');
		game.load.image('bg0', 'img/bg-lvl-0.png');
		game.load.image('bg1', 'img/bg-lvl-1.png');
		game.load.image('bg2', 'img/bg-lvl-2.png');
		game.load.image('bg3', 'img/bg-lvl-3.png');
		// game.load.image('shelf', 'img/shelf-platform.png');
		// game.load.image('window', 'img/window.png');
		// game.load.image('platform1', 'img/Platform-1.png');
		// game.load.image('platform2', 'img/Platform-2.png');
		// game.load.image('platform3', 'img/Platform-3.png');
		// game.load.image('platform4', 'img/Platform-4.png');
		// game.load.image('switch-holder', 'img/switch-holder.png');
		// game.load.image('switch-button', 'img/switch-button.png');
		// game.load.image('gear', 'img/gear.png');

		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		this.load.atlas('atlas', 'img/spritesheet.png', 'img/sprites.json');
		this.load.atlas('assets', 'img/assetsheet.png', 'img/assets.json')
		this.load.atlas('numbers', 'img/numbersheet.png', 'img/numbers.json');
		this.load.atlas('windowAni', 'img/windowAni.png', 'img/windowAni.json');
		this.load.atlas('patchesAtlas', 'img/patches.png', 'img/patches.json');
		this.load.atlas('patchesAtlas2', 'img/patches2.png', 'img/patches2.json');
		this.load.atlas('lvl2', 'img/lvl2-spritesheet.png', 'img/lvl2-spritesheet.json');

		game.load.audio('bgm', 'audio/bg-loop-temp.ogg');
		game.load.audio('collectGear', 'audio/collect-gear.ogg');
		game.load.audio('collision', 'audio/collision.ogg');
		game.load.audio('jump', 'audio/jump.ogg');
		game.load.audio('switchTrigger', 'audio/switch-trigger.ogg');
		game.load.audio('platform1audio', 'audio/platform-1.ogg');
		game.load.audio('platform2audio', 'audio/platform-2.ogg');
		game.load.audio('platform3audio', 'audio/platform-3.ogg');
		game.load.audio('platform4audio', 'audio/platform-4.ogg');
		game.load.audio('collect-gear', 'audio/collect-gear.ogg');
		game.load.audio('collision', 'audio/collision.ogg');
		game.load.audio('jump', 'audio/jump.ogg');
		game.load.audio('switch-trigger', 'audio/switch-trigger.ogg');

		
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
