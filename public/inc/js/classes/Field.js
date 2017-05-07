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
				{x: -1, y: -1}, {x: 0, y: -1},
				{x: 1, y: -1}, {x: -1, y: 0},
				{x: 1, y: 0}, {x: -1, y: 1},
				{x: 0, y: 1}, {x: 1, y: 1}
			];
			for(let i = 0; i < steps.length; i++) {
				let cellX = x + steps[i].x;
				let cellY = y + steps[i].y;
				if(this.isOnField(cellX, cellY) && !this.is(cellX, cellY, data) && !this.is(cellX, cellY, "B")) {
					this.cells[cellX][cellY] += data;
				}
			}
		}

		is(x, y, value) {
			if(this.isOnField(x, y) && this.cells[x][y].indexOf(value) != -1)
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
			for(let i = 0; i < this.width; i++) {
				let raw = [];
				for(let j = 0; j < this.height; j++) {
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