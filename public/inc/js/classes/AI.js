define([], function() {
	return class AI {
		constructor(player) {
			this.player = player.player;
			this.field = player.player.field;
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
			this.game = true;
			this.currentCellType = "G";
			this.cellsTypes = {
				"G": 0,
				"Y": 0,
				"W": 0
			}
			for(let x = 0; x < this.field.cells.length; x++)
				for(let y = 0; y < this.field.cells[x].length; y++)
					this.cellsTypes[this.field.cells[x][y][0]]++;
		}

		checkCellsTypes() {
			if(this.cellsTypes[this.currentCellType] == 0) {
				if(this.currentCellType == "G")
					this.currentCellType = "Y";
				if(this.cellsTypes[this.currentCellType] == 0)
					this.currentCellType = "W";
			}
		}

		generateAttack() {
			this.checkCellsTypes();
			var x, y;
			do {
				x = Math.floor(Math.random() * this.field.width);
				y = Math.floor(Math.random() * this.field.height);
			} while(this.field.is(x, y, "X") || !this.field.is(x, y, this.currentCellType));
			this.attackCell(x, y);
			if(this.field.is(x, y, "B") && this.field.isBoatExist(x, y)) {
				this.attackX = x;
				this.attackY = y;
				this.hit = true;
				this.attack();
			}
		}

		findOrientation() {
			let steps = [
				{ x: 0, y: 1, orientation: "V" },
				{ x: 0, y: -1, orientation: "V" },
				{ x: 1, y: 0, orientation: "H" },
				{ x: -1, y: 0, orientation: "H" }
			];
			var x = this.attackX + steps[this.currentStep].x;
			var y = this.attackY + steps[this.currentStep].y;
			if(this.field.isOnField(x, y)) {
				while(this.field.is(x, y, "X")) {
					this.currentStep = (this.currentStep + 1) % steps.length;
					let newX = this.attackX + steps[this.currentStep].x;
					let newY = this.attackY + steps[this.currentStep].y;
					if(this.field.isOnField(newX, newY)) {
						x = newX;
						y = newY;
					}
				}
				this.attackCell(x, y);
				if(this.field.is(x, y, "B")) {
					this.orientation = steps[this.currentStep].orientation;
					if(!this.field.isBoatExist(x, y)) {
						this.clearHitData();
					}
					this.attack();
				}
			} else {
				this.currentStep++;
				this.attack();
			}
		}

		checkHorizontal() {
			for(let i = 1; i < 4; i++) {
				if(this.directions.left && this.attackX - i >= 0) {
					this.attackCell(this.attackX - i, this.attackY);
					if(!this.field.is(this.attackX - i, this.attackY, "B")) {
						this.directions.left = false;
						break;
					}
				} else if(this.attackX + i < this.field.width) {
					this.attackCell(this.attackX + i, this.attackY);
					if(!this.field.is(this.attackX + i, this.attackY, "B")) {
						this.directions.right = false;
						break;
					}
				}
			}
		}

		checkVertical() {
			for(let i = 1; i < 4; i++) {
				if(this.directions.top && this.attackY - i >= 0) {
					this.attackCell(this.attackX, this.attackY - i);
					if(!this.field.is(this.attackX, this.attackY - i, "B")) {
						this.directions.top = false;
						break;
					}
				} else if(this.attackY + i < this.field.height) {
					this.attackCell(this.attackX, this.attackY + i);
					if(!this.field.is(this.attackX, this.attackY + i, "B")) {
						this.directions.bot = false;
						break;
					}
				}
			}
		}

		attack() {
			if(this.game) {
				if(!this.hit) {
					this.generateAttack();
				} else {
					if(!this.orientation) {
						this.findOrientation();
					} else {
						if(this.orientation === "H") {
							this.checkHorizontal();
						} else {
							this.checkVertical();
						}
						if(!this.field.findBoat(this.attackX, this.attackY)) {
							this.clearHitData();
							this.attack();
						}
					}
				}
			}
		}

		clearHitData() {
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
		}

		attackCell(x, y) {
			this.cellsTypes[this.field.cells[x][y][0]]--;
			this.field.cells[x][y] = "Z" + this.field.cells[x][y].substring(1);
			this.player.attack(x, y);
		}
	};
});