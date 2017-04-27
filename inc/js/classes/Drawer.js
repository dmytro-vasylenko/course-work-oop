define([], function() {

	const BOARD_COLOR = "rgba(0, 0, 255, 0.7)";

	return class Drawer {
		constructor(field, canvas) {
			this.field = field;
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");
			this.visible = true;
			this.fieldWidth = this.canvas.width;
			this.fieldHeight = this.canvas.height;
			this.cellWidth = 300/this.field.width;
			this.cellHeight = 300/this.field.height;
		}

		drawField(x, y) {
			
			for(var x = 0; x <= this.fieldWidth; x += this.cellWidth){
				this.context.moveTo(x, 0);
				this.context.lineTo(x, this.fieldHeight);
				this.context.stroke();
			}
			for(var y = 0; y <= this.fieldHeight; y += this.cellHeight) {
				this.context.moveTo(0, y);
				this.context.lineTo(this.fieldWidth, y);
				this.context.stroke();
			}
		}

		drawMine(x, y, target = false) {
			if(target) {
				var img = document.getElementById("bomb-miss");
				this.context.drawImage(img, x*this.cellWidth + this.cellWidth/4, y*this.cellHeight + this.cellHeight/4, this.cellWidth/2, this.cellHeight/2);
			} else {
				var img = document.getElementById("bomb-on-target");
				this.context.drawImage(img, x*this.cellWidth + 2, y*this.cellHeight + 2, this.cellWidth - 4, this.cellHeight - 4);
			}
		}

		fillCell(x, y, color) {
			this.context.fillStyle = color;
			this.context.fillRect(x*this.cellWidth + 1, y*this.cellHeight + 1, this.cellWidth - 2, this.cellHeight - 2);
		}

		drawBoat(boat) {
			if(this.visible) {
				for(var i = 0; i < boat.length; i++) {
					if(boat.orientation === "H")
						this.fillCell(boat.x + i, boat.y, BOARD_COLOR);
					else if(boat.orientation === "V")
						this.fillCell(boat.x, boat.y + i, BOARD_COLOR);
				}
			}
		}
	}
});