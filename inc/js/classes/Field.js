define([], function() {
	return class {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.boards = []
			this.cells = [];
			for(var i = 0; i < this.height; i++) {
				var raw = [];
				for(var j = 0; j < this.width; j++) {
					raw.push(null);
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
					&& this.cells[x + steps[i][0]][y + steps[i][1]] != "B")
						this.cells[x + steps[i][0]][y + steps[i][1]] = data;
			}
		}

		isBomb(x, y, param) {
			if(this.cells[x][y] == param)
				return true;

			return false;
		}

		findBoard(x, y) {
			for(var b = 0; b < this.boards.length; b++) {
				if(this.boards[b].x == x && this.boards[b].y == y) {
					return this.boards[b];
				}
			}
			if(x - 1 >= 0 && this.cells[x - 1][y] == "B")
				return this.findBoard(x - 1, y);
			else if(y - 1 >= 0 && this.cells[x][y - 1] == "B")
				return this.findBoard(x, y - 1);
		}
	}
});