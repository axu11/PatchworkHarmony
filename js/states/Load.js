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
		game.load.image('bg0', 'img/bg-lvl-0.png');
		game.load.image('bg1', 'img/bg-lvl-1.png');
		game.load.image('bg2', 'img/bg-lvl-2.png');
		game.load.image('bg3', 'img/bg-lvl-3.png');

		game.load.image('library', 'img/library.png');
		game.load.image('crane-platform', 'img/crane-platform.png');

		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		this.load.atlas('atlas', 'img/spritesheet.png', 'img/sprites.json');
		this.load.atlas('assets', 'img/assetsheet.png', 'img/assets.json')
		this.load.atlas('numbers', 'img/numbersheet.png', 'img/numbers.json');
		this.load.atlas('windowAni', 'img/windowAni.png', 'img/windowAni.json');
		this.load.atlas('patchesAtlas', 'img/patches.png', 'img/patches.json');
		this.load.atlas('patchesAtlas2', 'img/patches2.png', 'img/patches2.json');
		this.load.atlas('lvl2', 'img/lvl2-spritesheet.png', 'img/lvl2-spritesheet.json');

		// Music
		game.load.audio('intro', 'audio/mp3/intro-music.mp3');
		game.load.audio('menu', 'audio/mp3/menu-music.mp3');
		game.load.audio('lvl1', 'audio/ogg/level-1.ogg');
		game.load.audio('lvl2', 'audio/ogg/level-2.ogg');

		
		// Sound Effects
		game.load.audio('collectGear', 'audio/ogg/collect-gear.ogg');
		game.load.audio('collision', 'audio/ogg/collision.ogg');
		game.load.audio('jump', 'audio/ogg/jump.ogg');
		game.load.audio('switchTrigger', 'audio/ogg/switch-trigger.ogg');
		game.load.audio('platform1audio', 'audio/ogg/platform-1.ogg');
		game.load.audio('platform2audio', 'audio/ogg/platform-2.ogg');
		game.load.audio('platform3audio', 'audio/ogg/platform-3.ogg');
		game.load.audio('platform4audio', 'audio/ogg/platform-4.ogg');
		game.load.audio('collect-gear', 'audio/ogg/collect-gear.ogg');
		game.load.audio('collision', 'audio/ogg/collision.ogg');
		game.load.audio('jump', 'audio/ogg/jump.ogg');
		game.load.audio('switch-trigger', 'audio/ogg/switch-trigger.ogg');
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