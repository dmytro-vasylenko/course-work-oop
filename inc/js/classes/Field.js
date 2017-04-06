define(["Cell"], function(Cell) {
	return class {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.cells = [];
			for(var i = 0; i < this.height; i++) {
				var raw = [];
				for(var j = 0; j < this.width; j++) {
					raw.push(new Cell(30, 30, i*30, j*30));
				}
				this.cells.push(raw);
			}
		}
	}
});