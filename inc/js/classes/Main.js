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
	var player = new Player("Dmitry");
	player.init();
	var boardA = new Board(3, 3, 3, "HORIZONTAL");
	var boardB = new Board(0, 0, 4, "VERTICAL");
	player.addBoard(boardA);
	player.addBoard(boardB);
});
