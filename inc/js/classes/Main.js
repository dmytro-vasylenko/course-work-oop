require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Drawer: "Drawer",
		Player: "Player",
		Boat: "Boat",
		AI: "AI"
	}
});

function sleep(ms) {
	ms += new Date().getTime();
	while(new Date() < ms){}
}

var gameState = true;

require(["Player", "Boat"], function(Player, Boat) {
	var player = new Player("Dmitry", 10, 10, null, "canvas-player");
	player.init();
	player.canAttacked = false;
	player.generateBoats();
	player.giveAI();

	// var observer = {
	// 	onFieldClick: function() {
	// 		player.botAttack(player);
	// 	}
	// };

	var enemy = new Player("Enemy", 10, 10, {
		onFieldClick: function() {
			player.botAttack();
		}
	}, "canvas-enemy");
	enemy.init();
	enemy.drawer.visible = false;
	enemy.generateBoats();
});
