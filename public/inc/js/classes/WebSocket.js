define([], function() {
	const URL = window.location.href;


	return class WS {
		constructor(player, enemy, onload) {
			this.player = player;
			this.enemy = enemy;
			this.onload = onload;
			this.socket = io();

			this.socket.on("connect", () => {
				console.log("Connected to Socket.IO!");
				if(this.onload) {
					this.onload();
				}
			});

			this.socket.on("text", text => {
				console.log(data);
			});

			this.socket.on("url", id => {
				window.location = URL + id;
			});

			this.socket.on("field", data => {
				this.setField(data.cells, data.boats);
			});

			this.socket.on("attack", data => {
				this.player.attack(data.x, data.y);
			});

			this.socket.on("attack-state", data => {
				this.enemy.canAttacked = data;
				if(this.enemy.canAttacked) {
					$(this.enemy.canvas).css({"box-shadow": "0 0 5px 5px green"});
					$(this.player.canvas).css({"box-shadow": "none"});
				} else {
					$(this.enemy.canvas).css({"box-shadow": "none"});
					$(this.player.canvas).css({"box-shadow": "0 0 5px 5px red"});
				}
			});

			this.socket.on("disconnect", () => {
				console.log("closed...");
			});
		}

		setField(cells, boats) {
			this.enemy.field.cells = cells;
			this.enemy.field.boats = boats;
		}

		send(type, data) {
			this.socket.emit(type, data);
		}
	}
});