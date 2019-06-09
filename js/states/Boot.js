// Boot state used to preload the loading bar
var Boot = function(game) {};
Boot.prototype = {
	
	preload: function() {
		game.load.image('loading', 'assets/img/loading.png');
		game.load.atlas('patchesAtlas2', 'assets/img/patches2.png', 'assets/img/patches2.json');

	},

	create: function() {
		game.state.start('Load');
	}
}