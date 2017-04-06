define([], function() {
	return class Cell {
		constructor(width = 30, height = 30) {
			this.width = width;
			this.height = height;
		}
		get info() {
			return "(w: " + this.width + ", h: " + this.height + ")";
		}
	}
});