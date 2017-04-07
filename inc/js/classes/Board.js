define(["Draw"], function(Draw) {
	return class Board {
		constructor(x, y, length, orientation) {
			this.x = x;
			this.y = y;
			this.length = length;
			this.orientation = orientation;
		}
	}
});