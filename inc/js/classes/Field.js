define([], function() {
	return class Field {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.boats = []
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
					&& !this.is(x + steps[i][0], y + steps[i][1], "B"))
						this.cells[x + steps[i][0]][y + steps[i][1]] = data;
			}
		}

		is(x, y, param) {
			if(this.cells[x][y] != null && this.cells[x][y].indexOf(param) != -1)
				return true;

			return false;
		}

		findBoat(x, y) {
			for(var i = 0; i < this.boats.length; i++) {
				if(this.boats[i].x == x && this.boats[i].y == y) {
					return this.boats[i];
				}
			}
			if(x - 1 >= 0 && this.is(x - 1, y, "B"))
				return this.findBoat(x - 1, y);
			else if(y - 1 >= 0 && this.is(x, y - 1, "B"))
				return this.findBoat(x, y - 1);
		}

		deleteBoat(boat) {
			for(var i = 0; i < this.boats.length; i++) {
				if(this.boats[i] == boat)
					this.boats.splice(i, 1);
			}
		}

		clearCells() {
			this.cells = [];
			for(var i = 0; i < this.height; i++) {
				var raw = [];
				for(var j = 0; j < this.width; j++) {
					raw.push(null);
				}
				this.cells.push(raw);
			}
		}

		clearBoats() {
			this.boats = [];
		}
	}
});