define([], function() {
	return class Boat {
		constructor(x, y, length, orientation) {
			this.x = x;
			this.y = y;
			this.length = length;
			this.lives = length;
			this.orientation = orientation;
		}
	}
});