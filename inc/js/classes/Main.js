require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Draw: "Draw",
		Player: "Player"
	}
});

const CELL_WIDTH = 30;
const CELL_HEIGHT = 30;

require(["Player", "Board"], function(Player, Board) {
	// var player = new Player("Dmitry", 10, 10, "canvas-player");
	// player.init();

	var enemy = new Player("Enemy", 10, 10, "canvas-enemy");
	enemy.init();
	enemy.draw.visible = false;
	enemy.generateBoards();
	enemy.draw.drawMine(2, 2);
	enemy.draw.drawMine(6, 1, true);
});
