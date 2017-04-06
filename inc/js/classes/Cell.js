define([], function() {
	return class Cell {
		constructor(width = 30, height = 30, x = 0, y = 0) {
			this.width = width;
			this.height = height;
			this.x = x;
			this.y = y;
		}


		get info() {
			return "(w: " + this.width + ", h: " + this.height + ")";
		}
	}
});