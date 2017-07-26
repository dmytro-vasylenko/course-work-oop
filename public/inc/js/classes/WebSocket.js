define([], function() {
	const WEBSOCKET = "ws://battleship-dmitry.herokuapp.com";
	const URL = "http://battleship-dmitry.herokuapp.com/";

	return class WS {
		constructor(player, enemy, onload) {
			this.player = player;
			this.enemy = enemy;
			this.onload = onload;
			this.websocket = new WebSocket(WEBSOCKET);

			this.websocket.onopen = function() {
				console.log("Connected to " + WEBSOCKET);
				if(this.onload) {
					this.onload();
				}
			}.bind(this);

			this.websocket.onmessage = function(message) {
				message = JSON.parse(message.data);

				switch(message.type) {
					case "text":
						console.log(message.data);
						break;
					case "url":
						window.location = URL + message.data;
						break;
					case "field":
						this.setField(message.data.cells, message.data.boats);
						break;
					case "attack":
						this.player.attack(message.data.x, message.data.y);
						break;
					case "attack-state":
						this.enemy.canAttacked = message.data;
						if(this.enemy.canAttacked) {
							$(this.enemy.canvas).css({"box-shadow": "0 0 5px 5px green"});
							$(this.player.canvas).css({"box-shadow": "none"});
						} else {
							$(this.enemy.canvas).css({"box-shadow": "none"});
							$(this.player.canvas).css({"box-shadow": "0 0 5px 5px red"});
						}
						break;
				}
			}.bind(this);

			this.websocket.onclose = function() {
				console.log("closed...");
			};
		}

		setField(cells, boats) {
			this.enemy.field.cells = cells;
			this.enemy.field.boats = boats;
		}

		send(type, data) {
			this.websocket.send(JSON.stringify({
				type,
				data
			}));
		}
	}
});