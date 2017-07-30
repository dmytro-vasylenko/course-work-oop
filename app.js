const express = require("express");
var server = express();
const http = require("http").Server(server);
var io = require("socket.io")(http);

const PORT = process.env.PORT || 8080;

var clients = {};
var games = {};

server.use(express.static('public'));

http.listen(PORT, function() {
	console.log("Server started at port " + PORT);
});

server.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

server.get("/:id", function(req, res) {
	if(!games[req.params.id] || games[req.params.id].enemy)
		res.redirect("/");
	else
		res.sendFile(__dirname + "/public/online_index.html");
});

io.on("connection", function(socket) {
	socket.on("registration", function(data) {
		clients[data] = socket;
		console.log("new client:", data);
	});

	socket.on("startgame", function(userId) {
		var gameID = Math.random().toString().substr(2);
		games[gameID] = {
			creator: userId,
			enemy: null,
			state: true,
			turn: userId,
			creatorData: null,
			enemyData: null
		};
		socket.emit("url", gameID);
	});

	socket.on("ready", function(data) {
		var currentGame = games[data.game];
		if(!currentGame) {
			return;
		}
		if(currentGame.creator != data.user) {
			currentGame.enemy = data.user;
			currentGame.turn = currentGame.enemy;
			currentGame.enemyData = {
				cells: data.cells,
				boats: data.boats
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
		} else {
			currentGame.creatorData = {
				cells: data.cells,
				boats: data.boats
			};
			sendData(currentGame.creator, "attack-state", false);
		}
	});

	socket.on("attack", function(data) {
		var currentGame = games[data.game];
		if(currentGame.enemy && currentGame.turn == data.user) {
			var enemyPlayer = currentGame.creator;
			if(currentGame.turn == currentGame.creator)
				enemyPlayer = currentGame.enemy;
			sendData(enemyPlayer, "attack", {
				x: data.x,
				y: data.y
			});
		}
	});

	socket.on("swap", function(data) {
		var currentGame = games[data.game];
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
	});
});

function sendData(client, type, data) {
	if(!clients[client])
		return;

	clients[client].emit(type, data);
}