define([], function() {
	const WEBSOCKET = "ws://localhost:8081";
	const URL = "http://localhost:3000/";

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
						console.log("PIZDEC");
						this.enemy.canAttacked = message.data;
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