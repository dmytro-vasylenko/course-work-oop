define([], function() {

	const BOARD_COLOR = "red";

	return class Draw {
		constructor(selector) {
			this.selector = selector;
			this.canvas = document.getElementById(this.selector);
			this.context = this.canvas.getContext("2d");
			this.visible = true;
		}

		drawField(field, x, y) {
			for(var i = 0; i < field.cells.length; i++)
				for(var j = 0; j < field.cells[i].length; j++)
					this.drawCell(field.cells[i][j]);
		}

		drawCell(cell) {
			this.context.moveTo(cell.x, cell.y);
			this.context.lineTo(cell.x + cell.width, cell.y);
			this.context.lineTo(cell.x + cell.width, cell.y + cell.height);
			this.context.lineTo(cell.x, cell.y + cell.height);
			this.context.lineTo(cell.x, cell.y);
			this.context.stroke();
		}

		drawMine(x, y, target = false) {
			var img = document.getElementById(target ? "bomb-miss" : "bomb-on-target");
			this.context.drawImage(img, x*CELL_WIDTH + 2, y*CELL_HEIGHT + 2, CELL_WIDTH - 4, CELL_HEIGHT - 4);
		}

		fillCell(x, y, color) {
			this.context.fillStyle = color;
			this.context.fillRect(x*CELL_WIDTH + 1, y*CELL_HEIGHT + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
		}

		drawBoard(board) {
			if(this.visible) {
				for(var i = 0; i < board.length; i++) {
					if(board.orientation === "H")
						this.fillCell(board.x + i, board.y, BOARD_COLOR);
					else if(board.orientation === "V")
						this.fillCell(board.x, board.y + i, BOARD_COLOR);
				}
			}
		}
	}
});