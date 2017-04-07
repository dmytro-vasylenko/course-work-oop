define([], function() {
	return class Cell {
		constructor(width = 30, height = 30, x = 0, y = 0, data = null) {
			this.width = width;
			this.height = height;
			this.x = x;
			this.y = y;
			this.data = data;
		}
	}
});