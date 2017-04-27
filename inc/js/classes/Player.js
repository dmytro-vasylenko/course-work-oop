define(["Boat", "Drawer", "Field", "AI"], function(Boat, Drawer, Field, AI) {
	const MAX_BOAT_LENGTH = 4;

	return class Player {
		constructor(name, width, height, observer, selector) {
			this.name = name;
			this.observer = observer;
			this.field = new Field(width, height);
			this.canvas = document.getElementById(selector);
			this.drawer = new Drawer(this.field, this.canvas);
			this.canAttacked = true;

			document.getElementById(selector).addEventListener("mousedown", this.onFieldClick.bind(this), false);
		}

		init() {
			this.drawer.drawField(this.field);
		}

		addBoard(boat) {
			this.field.boats.push(boat);
			this.drawer.drawBoat(boat);

			for(var i = 0; i < boat.length; i++) {
				if(boat.orientation === "H") {
					this.field.setCellsAround(boat.x + i, boat.y);
					this.field.cells[boat.x + i][boat.y] = "B";
				}
				else if(boat.orientation === "V") {
					this.field.setCellsAround(boat.x, boat.y + i);
					this.field.cells[boat.x][boat.y + i] = "B";
				}
			}
		}

		generateBoats() {
			for(var length = MAX_BOAT_LENGTH; length > 0; length--) {
				for(var number = MAX_BOAT_LENGTH - length + 1; number > 0; number--) {
					while(true) {
						var x = Math.round(Math.random() * (this.field.width - 1));
						var y = Math.round(Math.random() * (this.field.height - 1));
						var orientation = Math.round(Math.random() * 2) % 2 === 1 ? "H" : "V";
						var boat = new Boat(x, y, length, orientation);
						if(this.canAddBoard(boat)) {
							this.addBoard(boat);
							break;
						}
					}
					// alert(this.printField());
				}
			}
			// alert("OK");
		}

		printField() {
			var result = "";
			var counter = 0;
			for(var i = 0; i < this.field.cells.length; i++) {
				for(var j = 0; j < this.field.cells[i].length; j++) {
					if(this.field.is(i, j, "B"))
						counter++;
					result += (this.field.cells[i][j] ? this.field.cells[i][j] + "  " : ".    ");
				}
				result += "\n";
			}

			return result;
		}

		canAddBoard(boat) {

			if(boat.length === 1) {
				if(this.field.is(boat.x, boat.y, "N") ||
					this.field.is(boat.x, boat.y, "B"))
					return false;

				return true;
			}

			if(boat.orientation === "H") {
				if(boat.x + boat.length > this.field.width)
					return false;

				for(var i = 0; i < boat.length; i++)
					if(this.field.is(boat.x + i, boat.y, "N") ||
						this.field.is(boat.x + i, boat.y, "B"))
						return false;
			}
			else if(boat.orientation === "V") {
				if(boat.y + boat.length > this.field.height)
					return false;

				for(var i = 0; i < boat.length; i++) {
					if(this.field.is(boat.x, boat.y + i, "N") ||
						this.field.is(boat.x, boat.y + i, "B"))
						return false;
				}
			}

			return true;
		}

		onFieldClick(event) {
			if(this.canAttacked) {
				var x = event.x - document.getElementById("playground").offsetLeft - this.canvas.offsetLeft;
				var y = event.y - document.getElementById("playground").offsetTop - this.canvas.offsetTop;
				console.log({x, y});

				var cellX = Math.floor(x / this.drawer.cellWidth);
				var cellY = Math.floor(y / this.drawer.cellHeight);
				
				this.attack(cellX, cellY);
			}
		}

		attack(x, y) {
			var hit = false;
			if(!this.field.is(x, y, "X")) {
				this.field.cells[x][y] = this.field.cells[x][y] ? this.field.cells[x][y] + "X" : "X";
				if(this.field.is(x, y, "B")) {
					hit = true;
					this.drawer.drawMine(x, y);
					var boat = this.field.findBoat(x, y);
					boat.lives--;
					if(!boat.lives) {
						this.field.deleteBoat(boat);
						var steps = [
							[-1, -1], [0, -1], [1, -1],
							[-1, 0], [1, 0],
							[-1, 1], [0, 1], [1, 1]
						];
						var k = [];
						if(boat.orientation == "H")
							k = [1, 0];
						else if(boat.orientation == "V")
							k = [0, 1];

						for(var l = 0; l < boat.length; l++) {
							for(var i = 0; i < steps.length; i++) {
								var x = boat.x + steps[i][0] + l*k[0];
								var y = boat.y + steps[i][1] + l*k[1];
								if(x >= 0 && y >= 0 && x < this.field.width && y < this.field.height &&
									this.field.is(x, y, "N") && !this.field.is(x, y, "X")) {

									this.drawer.drawMine(x, y, true);
									this.field.cells[x][y] += "X";
								}
							}
						}
					}
					if(this.checkWin()) {
						alert(this.name + " LOST!!");
					}
				} else {
					this.drawer.drawMine(x, y, true);
				}
				if(this.observer && !hit)
				{
					this.printField();
					this.observer.onFieldClick();
				}
			}
		}

		checkWin() {
			if(!this.field.boats.length)
				return true;

			return false;
		}

		giveAI() {
			this.AI = new AI({
				player: this
			});
		}

		botAttack() {
			this.AI.attack();
		}
	};
});