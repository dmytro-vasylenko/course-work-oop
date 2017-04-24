define([], function() {
	return class AI {
		constructor(player) {
			// console.log(player);
			this.player = player.player;
			this.hit = false;
			this.attackX = 0;
			this.attackY = 0;
			this.orientation = null;
			this.currentStep = 0;
			this.directions = {
				left: true,
				right: true,
				top: true,
				bot: true
			};
		}

		attack() {
			// console.log({});
			if(!this.hit) {
				do {
					var x = Math.floor(Math.random() * this.player.field.width);
					var y = Math.floor(Math.random() * this.player.field.height);
				} while(this.player.field.is(x, y, "X"));
				this.attackCell(x, y);
				console.log({x, y, cell: this.player.field.cells[x][y]});
				this.player.printField();
				if(this.player.field.is(x, y, "B")) {
					if(!this.player.field.findBoat(x, y)) {
						this.attack();
					} else {
						this.attackX = x;
						this.attackY = y;
						this.hit = true;
						this.attack();
					}
				}
			} else {
				if(!this.orientation) {
					var steps = [
						[0, 1, "V"], [0, -1, "V"], [1, 0, "H"], [-1, 0, "H"]
					];
					var x = this.attackX + steps[this.currentStep][0];
					var y = this.attackY + steps[this.currentStep][1];
					if(x >= 0 && x < this.player.field.width && y >= 0 && y < this.player.field.height) {
						while(this.player.field.is(x, y, "X")) {
							this.currentStep = (this.currentStep + 1) % steps.length;
							var newX = this.attackX + steps[this.currentStep][0];
							var newY = this.attackY + steps[this.currentStep][1];
							if(newX >= 0 && newX < this.player.field.width && newY >= 0 && newY < this.player.field.height) {
								x = newX;
								y = newY;
							}
							console.log({x, y});
						}

						this.attackCell(x, y);
						if(this.player.field.is(x, y, "B")) {
							this.orientation = steps[this.currentStep][2];
							var boat = this.player.field.findBoat(x, y);
							if(boat == null) {
								this.hit = false;
								this.orientation = null;
								this.attackX = 0;
								this.attackY = 0;
								this.currentStep = 0;
							}
							this.attack();
						}
					} else {
						this.currentStep++;
						this.attack();
					}
				} else {
					for(var i = 1; i < 4; i++) {
						if(this.orientation == "H") {
							if(this.directions.left && this.attackX - i >= 0) {
								this.attackCell(this.attackX - i, this.attackY);
								if(!this.player.field.is(this.attackX - i, this.attackY, "B")) {
									this.directions.left = false;
									break;
								}
							} else if(this.attackX + i < this.player.field.width) {
								this.attackCell(this.attackX + i, this.attackY);
								if(!this.player.field.is(this.attackX + i, this.attackY, "B")) {
									this.directions.right = false;
									break;
								}
							}
						} else {
							if(this.directions.top && this.attackY - i >= 0) {
								this.attackCell(this.attackX, this.attackY - i);
								if(!this.player.field.is(this.attackX, this.attackY - i, "B")) {
									this.directions.top = false;
									break;
								}
							} else if(this.attackY + i < this.player.field.height) {
								this.attackCell(this.attackX, this.attackY + i);
								if(!this.player.field.is(this.attackX, this.attackY + i, "B")) {
									this.directions.bot = false;
									break;
								}
							}
						}
					}
					if(!this.player.field.findBoat(this.attackX, this.attackY)) {
						this.orientation = null;
						this.attackX = 0;
						this.attackY = 0;
						this.currentStep = 0;
						this.hit = false;
						this.directions = {
							left: true,
							right: true,
							top: true,
							bot: true
						};
						this.attack();
					}
				}
			}
		}

		attackCell(x, y) {
			this.player.attack(x, y);
		}
	};
});