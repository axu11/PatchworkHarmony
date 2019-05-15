// Second level state, rooftops
var Level2 = function(game) {};
Level2.prototype = {

	init: function() {
		numPlatforms = 0;
	},

	create: function() {

	// Create number circle at top left of screen to indicate platforms remaining
		this.numberPosition = 16;
		this.number0 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number0');
		this.number0.scale.set(0.5);
		this.number0.fixedToCamera = true;
		this.number1 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number1');
		this.number1.scale.set(0);
		this.number1.fixedToCamera = true;
		this.number2 = game.add.image(this.numberPosition, this.numberPosition, 'numbers', 'number2');
		this.number2.scale.set(0);
		this.number2.fixedToCamera = true;

		/***** PLAYER SPRITE *****/ 
		this.players = game.add.group();
		this.player = new Patches(game, 'patches', 100, 400);
		this.player.enableBody = true;
		this.players.add(this.player);

		/***** MUSIC BOX *****/
		this.box = game.add.sprite(350, 250, 'box');
		game.physics.arcade.enable(this.box);
		this.box.anchor.set(0.50);
		this.box.scale.set(0.75);
		this.box.body.collideWorldBounds = true;
		this.box.body.gravity.y = 300; // Has gravity while not held by player
		this.box.body.drag = 0.5;
		this.attached = false; // Initially not picked up by player

		/***** PLATFORMS *****/
		// Create platforms group
		platforms = game.add.group();
		platforms.enableBody = true;

		// Creates a collectible "gear" that will enable player to unlock an ability
		this.gear = game.add.sprite(820, 80, 'gear'); 
		game.physics.arcade.enable(this.gear);
		this.gear.body.immovable = true;
		this.gear.body.allowGravity = false;
		this.gear.scale.setTo(0.5,0.5);	
	},
	update: function(){

	},
	render: function() {

	}
}