define(["Cell"], function(Cell) {
	return class {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.cells = [];
			for(var i = 0; i < this.height; i++) {
				var raw = [];
				for(var j = 0; j < this.width; j++) {
					raw.push(new Cell(CELL_WIDTH, CELL_HEIGHT, i*CELL_WIDTH, j*CELL_HEIGHT));
				}
				this.cells.push(raw);
			}
		}

		setCellsAround(x, y, data = "N") {
			var steps = [
				[-1, -1], [0, -1], [1, -1],
				[-1, 0], [1, 0],
				[-1, 1], [0, 1], [1, 1]
			];

			for(var i = 0; i < steps.length; i++) {
				if(x + steps[i][0] < this.width && y + steps[i][1] < this.height
					&& x + steps[i][0] >= 0 && y + steps[i][1] >= 0
					&& this.cells[x + steps[i][0]][y + steps[i][1]].data != "B")
					this.cells[x + steps[i][0]][y + steps[i][1]].data = data;
			}
		}
	}
});