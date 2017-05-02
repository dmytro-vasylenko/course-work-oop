define([], function() {
	return class WS {
		constructor(player, onload) {
			this.player = player;
			this.onload = onload;
			this.websocket = new WebSocket("ws://localhost:8081");

			this.websocket.onopen = (function() {
				console.log("Connected to ws://localhost:8081");
				if(this.onload)
					this.onload();
			}).bind(this);

			this.websocket.onmessage = (function(message) {
				message = JSON.parse(message.data);
				if(message.type == "url") {
					window.location = "http://localhost:3000/" + message.data;
				} else if(message.type == "attack") {
					this.player.attack(message.data.x, message.data.y);
				}
			}).bind(this);
		}

		send(type, data) {
			this.websocket.send(JSON.stringify({
				type,
				data
			}));
		}
	}
});