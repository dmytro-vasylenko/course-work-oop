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
			this.drawer.drawField();
		}

		addBoard(boat) {
			this.field.boats.push(boat);
			this.drawer.drawBoat(boat);

			for(let i = 0; i < boat.length; i++) {
				if(boat.orientation === "H") {
					this.field.setCellsAround(boat.x + i, boat.y);
					this.field.cells[boat.x + i][boat.y] += "B";
				} else if(boat.orientation === "V") {
					this.field.setCellsAround(boat.x, boat.y + i);
					this.field.cells[boat.x][boat.y + i] += "B";
				}
			}
		}

		generateBoats() {
			for(let length = MAX_BOAT_LENGTH; length > 0; length--) {
				for(let number = MAX_BOAT_LENGTH - length + 1; number > 0; number--) {
					while(true) {
						let x = Math.round(Math.random() * (this.field.width - 1));
						let y = Math.round(Math.random() * (this.field.height - 1));
						let orientation = Math.round(Math.random() * 2) % 2 === 1 ? "H" : "V";
						let boat = new Boat(x, y, length, orientation);
						if(this.canAddBoard(boat)) {
							this.addBoard(boat);
							break;
						}
					}
				}
			}
		}

		printField() {
			let result = "";
			let counter = 0;
			for(let i = 0; i < this.field.cells.length; i++) {
				for(let j = 0; j < this.field.cells[i].length; j++) {
					if(this.field.is(i, j, "B")) {
						counter += 1;
					}
					result += this.field.cells[i][j][0] + " ";
					// result += this.field.is(j, i, "B") ? "X " : ". ";
				}
				result += "\n";
			}

			return result;
		}

		canAddBoard(boat) {
			if(boat.length === 1) {
				if(!this.field.isEmptyOfBoat(boat.x, boat.y))
					return false;

				return true;
			}

			if(boat.orientation === "H") {
				if(boat.x + boat.length > this.field.width)
					return false;

				for(let i = 0; i < boat.length; i++)
					if(!this.field.isEmptyOfBoat(boat.x + i, boat.y))
						return false;
			} else if(boat.orientation === "V") {
				if(boat.y + boat.length > this.field.height)
					return false;

				for(let i = 0; i < boat.length; i++) {
					if(!this.field.isEmptyOfBoat(boat.x, boat.y + i))
						return false;
				}
			}

			return true;
		}

		onFieldClick(event) {
			if(this.canAttacked) {
				let x = event.x - document.getElementById("playground").offsetLeft - this.canvas.offsetLeft;
				let y = event.y - document.getElementById("playground").offsetTop - this.canvas.offsetTop;
				if(x >= this.canvas.width)
					x = this.canvas.width - 1;
				if(y >= this.canvas.height)
					y = this.canvas.height - 1;
				let cellX = Math.floor(x / this.drawer.cellWidth);
				let cellY = Math.floor(y / this.drawer.cellHeight);
				this.attack(cellX, cellY);
			}
		}

		// TODO: укоротить метод за счет выноса ВС
		attack(x, y) {
			var hit = false;
			if(!this.field.is(x, y, "X")) {
				if(this.observer.gameType && this.observer.gameType == "ONLINE") {
					this.observer.ws.send("attack", {
						game: gameID,
						user: $.cookie("user-id"),
						x,
						y
					});
					if(!this.field.is(x, y, "B")) {
						this.observer.ws.send("swap", { game: gameID });
						this.canAttacked = false;
					}
				}
				this.field.cells[x][y] = this.field.cells[x][y] ? this.field.cells[x][y] + "X" : "X";
				if(this.field.is(x, y, "B")) {
					hit = true;
					this.drawer.drawMine(x, y);
					let boat = this.field.findBoat(x, y);
					if(!--boat.lives) {
						this.killBoat(boat);
					}
					this.checkLose();
				} else {
					this.drawer.drawMine(x, y, true);
				}
				if(this.observer.onFieldClick && !hit) {
					this.observer.onFieldClick();
				}
			}
		}

		//TODO: вынести AI нахуй
		killBoat(boat) {
			this.field.deleteBoat(boat);
			let steps = [
				[-1, -1], [0, -1], [1, -1],
				[-1, 0], [0, 0], [1, 0],
				[-1, 1], [0, 1], [1, 1]
			];
			let k = [];
			if(boat.orientation == "H")
				k = [1, 0];
			else if(boat.orientation == "V")
				k = [0, 1];

			for(let l = 0; l < boat.length; l++) {
				for(let i = 0; i < steps.length; i++) {
					let x = boat.x + steps[i][0] + l*k[0];
					let y = boat.y + steps[i][1] + l*k[1];
					if(this.field.isOnField(x, y) && this.field.is(x, y, "N") && !this.field.is(x, y, "X")) {
						this.drawer.drawMine(x, y, true);
						this.field.cells[x][y] += "X";
						if(this.AI)
							this.AI.cellsTypes[this.field.cells[x][y][0]]--;
					}
				}
			}
		}

		checkLose() {
			if(!this.field.boats.length) {
				if(this.AI)
					this.AI.game = false;
				if(this.observer.loss)
					this.observer.loss();
				this.canAttacked = false;
				$("#window-win b").text(this.name);
				$("#window-win").css({zIndex: 100});
				$("#window-win").removeClass("fadeOut");
				$("#window-win").addClass("fadeInDown");
			}
		}

		giveAI() {
			this.AI = new AI({ player: this });
		}

		botAttack() {
			this.AI.attack();
		}

		reset() {
			this.canAttacked = true;
			this.drawer.clearField();
			this.field.clearCells();
			this.field.clearBoats();
			this.drawer.drawField();
			if(this.AI) {
				this.AI = new AI({ player: this });
			}
			this.generateBoats();
		}
	};
});