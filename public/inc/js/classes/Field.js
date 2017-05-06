define([], function() {
	return class Field {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.boats = []
			this.cells = [];
			this.generateCells();
		}

		setCellsAround(x, y, data = "N") {
			let steps = [
				[-1, -1], [0, -1], [1, -1],
				[-1, 0], [1, 0],
				[-1, 1], [0, 1], [1, 1]
			];

			for(let i = 0; i < steps.length; i++) {
				let cellX = x + steps[i][0];
				let cellY = y + steps[i][1];
				if(this.isOnField(cellX, cellY) && !this.is(cellX, cellY, "B")) {
					this.cells[cellX][cellY] += data;
				}
			}
		}

		is(x, y, value) {
			if(this.cells[x][y] != null && this.cells[x][y].indexOf(value) != -1)
				return true;

			return false;
		}

		isEmptyOfBoat(x, y) {
			return !this.is(x, y, "N") && !this.is(x, y, "B");
		}

		isOnField(x, y) {
			return x >= 0 && y >= 0 && x < this.width && y < this.height;
		}

		isBoatExist(x, y) {
			return this.findBoat(x, y) != null;
		}

		findBoat(x, y) {
			for(let i = 0; i < this.boats.length; i++) {
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
			for(let i = 0; i < this.boats.length; i++) {
				if(this.boats[i] == boat)
					this.boats.splice(i, 1);
			}
		}

		clearCells() {
			this.cells = [];
			this.generateCells();
		}

		generateCells() {
			let counter = -1;
			for(let i = 0; i < this.height; i++) {
				let raw = [];
				for(let j = 0; j < this.width; j++) {
					raw.push((counter++ % 4 == 0 ? "Y" : counter % 2 == 0 ? "W" : "G").toString());
				}
				counter--;
				this.cells.push(raw);
			}
		}

		clearBoats() {
			this.boats = [];
		}
	}
});