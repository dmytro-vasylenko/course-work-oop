define(["Board", "Drawer", "Field"], function(Board, Drawer, Field) {
	const MAX_BOARD_LENGTH = 4;

	return class Player {
		constructor(name, width, height, selector) {
			this.name = name;
			this.field = new Field(width, height);
			this.canvas = document.getElementById(selector);
			this.drawer = new Drawer(this.field, this.canvas);

			document.getElementById(selector).addEventListener("mousedown", this.onFieldClick.bind(this), false);
		}

		init() {
			this.drawer.drawField(this.field);
		}

		addBoard(board) {
			this.field.boards.push(board);
			this.drawer.drawBoard(board);

			for(var i = 0; i < board.length; i++) {
				if(board.orientation === "H") {
					this.field.setCellsAround(board.x + i, board.y);
					this.field.cells[board.x + i][board.y] = "B";
				}
				else if(board.orientation === "V") {
					this.field.setCellsAround(board.x, board.y + i);
					this.field.cells[board.x][board.y + i] = "B";
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
					if(this.field.cells[j][i] === "B")
						counter++;
					result += (this.field.cells[j][i] === null ? "." : this.field.cells[j][i])  + " ";
				}
				result += "\n";
			}

			console.log(result, counter);
		}

		canAddBoard(board) {

			if(board.length === 1) {
				if(this.field.cells[board.x][board.y] === "N"
					|| this.field.cells[board.x][board.y] === "B")
					return false;

				return true;
			}

			if(board.orientation === "H") {
				if(board.x + board.length > this.field.width)
					return false;

				for(var i = 0; i < board.length; i++)
					if(this.field.cells[board.x + i][board.y] === "N"
						|| this.field.cells[board.x + i][board.y] === "B")
						return false;
			}
			else if(board.orientation === "V") {
				if(board.y + board.length > this.field.height)
					return false;

				for(var i = 0; i < board.length; i++) {
					if(this.field.cells[board.x][board.y + i] === "N"
						|| this.field.cells[board.x][board.y + i] == "B")
						return false;
				}
			}

			return true;
		}

		onFieldClick(event) {
			var x = event.x - this.canvas.offsetLeft;
			var y = event.y - this.canvas.offsetTop;

			var cellX = Math.floor(x / this.drawer.cellWidth);
			var cellY = Math.floor(y / this.drawer.cellHeight);
			if(!this.field.isBomb(cellX, cellY)) {
				if(this.field.cells[cellX][cellY] == "B") {
					this.drawer.drawMine(cellX, cellY);
					var board = this.field.findBoard(cellX, cellY);
					board.lives--;
					if(!board.lives) {
						var steps = [
							[-1, -1], [0, -1], [1, -1],
							[-1, 0], [1, 0],
							[-1, 1], [0, 1], [1, 1]
						];
						var k = [];
						if(board.orientation == "H")
							k = [1, 0];
						else if(board.orientation == "V")
							k = [0, 1];

						for(var l = 0; l < board.length; l++) {
							for(var i = 0; i < steps.length; i++) {
								if(board.x + steps[i][0] + l*k[0] >= 0 && board.y + steps[i][1] + l*k[1] >= 0 &&
									board.x + steps[i][0] + l*k[0] < this.field.width && board.y + steps[i][1] + l*k[1] < this.field.width &&
									this.field.cells[board.x + steps[i][0] + l*k[0]][board.y + steps[i][1] + l*k[1]] == "N") {
									this.drawer.drawMine(board.x + steps[i][0] + l*k[0], board.y + steps[i][1] + l*k[1], true);
								}
							}
						}
					}
				} else {
					this.drawer.drawMine(cellX, cellY, true);
				}
			}
		}

		attackBot() {

		}
	}
});