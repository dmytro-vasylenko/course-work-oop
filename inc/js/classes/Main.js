require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Drawer: "Drawer",
		Player: "Player"
	}
});

require(["Player", "Board"], function(Player, Board) {
	var player = new Player("Dmitry", 10, 10, "canvas-player");
	player.init();
	player.canAttacked = false;
	player.generateBoards();

	var enemy = new Player("Enemy", 10, 10, "canvas-enemy");
	enemy.init();
	enemy.drawer.visible = false;
	enemy.generateBoards();
});
