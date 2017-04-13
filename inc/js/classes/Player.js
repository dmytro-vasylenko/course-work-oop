define(["Cell", "Board", "Draw", "Field"], function(Cell, Board, Draw, Field) {
	const MAX_BOARD_LENGTH = 4;

	return class Player {
		constructor(name, width, height, selector) {
			this.name = name;
			this.field = new Field(width, height);
			this.draw = new Draw(selector);
			this.boards = [];
		}

		init() {
			this.draw.drawField(this.field);
		}

		addBoard(board) {
			this.boards.push(board);
			this.draw.drawBoard(board);

			for(var i = 0; i < board.length; i++) {
				if(board.orientation === "H") {
					this.field.setCellsAround(board.x + i, board.y);
					this.field.cells[board.x + i][board.y].data = "B";
				}
				else if(board.orientation === "V") {
					this.field.setCellsAround(board.x, board.y + i);
					this.field.cells[board.x][board.y + i].data = "B";
				}
			}
		}

		generateBoards() {
			for(var length = 1; length <= MAX_BOARD_LENGTH; length++) {
				for(var number = MAX_BOARD_LENGTH - length + 1; number > 0; number--) {
					while(true) {
						var x = Math.round(Math.random() * (this.field.width - 1));
						var y = Math.round(Math.random() * (this.field.height - 1));
						var orientation = Math.round(Math.random() * 2) % 2 === 1 ? "H" : "V";
						var board = new Board(x, y, length, orientation);
						if(this.canAddBoard(board)) {
							this.addBoard(board);
							break;
						}
					}
				}
			}
		}

		printField() {
			var result = "";
			var counter = 0;
			for(var i = 0; i < this.field.cells.length; i++) {
				for(var j = 0; j < this.field.cells[i].length; j++) {
					if(this.field.cells[j][i].data === "B")
						counter++;
					result += (this.field.cells[j][i].data === null ? "." : this.field.cells[j][i].data)  + " ";
				}
				result += "\n";
			}

			console.log(result, counter);
		}

		canAddBoard(board) {

			if(board.length === 1) {
				if(this.field.cells[board.x][board.y].data === "N"
					|| this.field.cells[board.x][board.y].data === "B")
					return false;

				return true;
			}

			if(board.orientation === "H") {
				if(board.x + board.length > this.field.width)
					return false;

				for(var i = 0; i < board.length; i++)
					if(this.field.cells[board.x + i][board.y].data === "N"
						|| this.field.cells[board.x + i][board.y].data === "B")
						return false;
			}
			else if(board.orientation === "V") {
				if(board.y + board.length > this.field.height)
					return false;

				for(var i = 0; i < board.length; i++) {
					if(this.field.cells[board.x][board.y + i].data === "N"
						|| this.field.cells[board.x][board.y + i].data == "B")
						return false;
				}
			}

			return true;
		}
	}
});