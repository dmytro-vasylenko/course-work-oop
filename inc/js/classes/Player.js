define(["Cell", "Board", "Draw", "Field"], function(Cell, Board, Draw, Field) {
	return class Player {
		constructor(name) {
			this.name = name;
			this.field = new Field(10, 10);
			this.draw = new Draw("canvas");
			this.boards = [];
		}

		init() {
			this.draw.drawField(this.field);
		}

		addBoard(board) {
			this.boards.push(board);
			this.draw.drawBoard(board);
		}
	}
});