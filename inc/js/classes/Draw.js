define([], function() {
	return class Draw {
		constructor(selector) {
			this.selector = selector;
			this.canvas = document.getElementById(this.selector);
			this.context = this.canvas.getContext("2d");
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
	}
});