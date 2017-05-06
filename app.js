var express = require("express");
var WebSocket = require("ws");

var app = express();

var clients = {};
var games = {};

app.use(express.static('public'));

var websocket = new WebSocket.Server({
	port: 8081
});

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get("/:id", function(req, res) {
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
		case "ready":
			var currentGame = games[message.data.game];
			if(currentGame.creator != message.data.user) {
				currentGame.enemy = message.data.user;
				currentGame.enemyData = {
					cells: message.data.cells,
					boats: message.data.boats
				};

				clients[currentGame.creator].send(JSON.stringify({
					type: "field",
					data: {
						cells: currentGame.enemyData.cells,
						boats: currentGame.enemyData.boats,
					}
				}));
				clients[currentGame.enemy].send(JSON.stringify({
					type: "field",
					data: {
						cells: currentGame.creatorData.cells,
						boats: currentGame.creatorData.boats,
					}
				}));
			} else {
				currentGame.creatorData = {
					cells: message.data.cells,
					boats: message.data.boats
				};
			}
			break;
		case "attack":
			var currentGame = games[message.data.game];
			if(currentGame.enemy && currentGame.turn != message.data.user) {
				clients[currentGame.turn].send(JSON.stringify({
					type: "attack",
					data: {
						x: message.data.x,
						y: message.data.y
					}
				}));
			}
			break;
		case "swap":
			currentGame = games[message.data.game];
			if(currentGame.turn == currentGame.creator) {
				currentGame.turn = currentGame.enemy;
				clients[currentGame.creator].send(JSON.stringify({
					type: "attack-state",
					data: null
				}));
			}
			else {
				clients[currentGame.enemy].send(JSON.stringify({
					type: "attack-state",
					data: null
				}));
				currentGame.turn = currentGame.creator;
			}
			break;
		}
	});
});


app.listen(3000, function() {
	console.log("Server started at http://localhost:3000/");
});