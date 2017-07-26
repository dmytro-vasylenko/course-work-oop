const express = require("express");
const SocketServer = require("ws").Server;

const PORT = process.env.PORT || 8080;

var clients = {};
var games = {};

const server = express()
	.use(express.static('public'))
	.listen(PORT, function() {
		console.log("Server started at port " + PORT);
	});

const websocket = new SocketServer({server});

server.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

server.get("/:id", function(req, res) {
	if(!games[req.params.id])
		res.redirect("/");
	else
		res.sendFile(__dirname + "/public/online_index.html");
});

websocket.on("connection", function(ws) {
	ws.on("message", function(message) {
		message = JSON.parse(message);
		switch(message.type) {
		case "registration":
			clients[message.data] = ws;
			console.log("new client:", message.data);
			break;
		case "startgame":
			var gameID = Math.random().toString().substr(2);
			games[gameID] = {
				creator: message.data,
				enemy: null,
				state: true,
				turn: message.data,
				creatorData: null,
				enemyData: null
			};
			ws.send(JSON.stringify({
				type: "url",
				data: gameID
			}));
			break;
		// TODO: сделать проверку на больше чем три игрока в одной игре
		case "ready":
			var currentGame = games[message.data.game];
			if(currentGame.creator != message.data.user) {
				currentGame.enemy = message.data.user;
				currentGame.turn = currentGame.enemy;
				currentGame.enemyData = {
					cells: message.data.cells,
					boats: message.data.boats
				};

				sendData(currentGame.creator, "field", {
					cells: currentGame.enemyData.cells,
					boats: currentGame.enemyData.boats
				});
				sendData(currentGame.enemy, "field", {
					cells: currentGame.creatorData.cells,
					boats: currentGame.creatorData.boats,
				});
				sendData(currentGame.enemy, "attack-state", true);
				console.log(games);
			} else {
				currentGame.creatorData = {
					cells: message.data.cells,
					boats: message.data.boats
				};
				sendData(currentGame.creator, "attack-state", false);
			}
			break;
		case "attack":
			var currentGame = games[message.data.game];
			if(currentGame.enemy && currentGame.turn == message.data.user) {
				var enemyPlayer = currentGame.creator;
				if(currentGame.turn == currentGame.creator)
					enemyPlayer = currentGame.enemy;
				sendData(enemyPlayer, "attack", {
					x: message.data.x,
					y: message.data.y
				});
			}
			break;
		case "swap":
			currentGame = games[message.data.game];
			if(currentGame.turn == currentGame.creator) {
				currentGame.turn = currentGame.enemy;
				sendData(currentGame.creator, "attack-state", false);
				sendData(currentGame.enemy, "attack-state", true);
			}
			else {
				sendData(currentGame.enemy, "attack-state", false);
				sendData(currentGame.creator, "attack-state", true);
				currentGame.turn = currentGame.creator;
			}
			break;
		}
	});
});

function sendData(client, type, data) {
	if(!clients[client])
		return;

	clients[client].send(JSON.stringify({
		type,
		data
	}));
}