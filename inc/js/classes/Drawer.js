define([], function() {

	const BOARD_COLOR = "red";

	return class Draw {
		constructor(field, canvas) {
			this.field = field;
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");
			this.visible = true;
			this.fieldWidth = this.canvas.width;
			this.fieldHeight = this.canvas.height;
			this.cellWidth = 300/this.field.width;
			this.cellHeight = 300/this.field.height;
		}

		drawField(x, y) {
			for(var x = 0; x <= this.fieldWidth; x += this.cellWidth){
				this.context.moveTo(x, 0);
				this.context.lineTo(x, this.fieldHeight);
				this.context.stroke();
			}
			for(var y = 0; y <= this.fieldHeight; y += this.cellHeight) {
				this.context.moveTo(0, y);
				this.context.lineTo(this.fieldWidth, y);
				this.context.stroke();
			}
		}

		drawMine(x, y, target = false) {
			var img = document.getElementById(target ? "bomb-miss" : "bomb-on-target");
			this.context.drawImage(img, x*this.cellWidth + 2, y*this.cellHeight + 2, this.cellWidth - 4, this.cellHeight - 4);
		}

		fillCell(x, y, color) {
			this.context.fillStyle = color;
			this.context.fillRect(x*this.cellWidth + 1, y*this.cellHeight + 1, this.cellWidth - 2, this.cellHeight - 2);
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