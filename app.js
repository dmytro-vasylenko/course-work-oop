var express = require("express");
var WebSocket = require("ws");

var app = express();

var clients = [];
var games = {};

app.use(express.static('public'));

var websocket = new WebSocket.Server({
	port: 8081
});

app.get("/", function(req, res) {
	res.sendfile("index.html");
});
	websocket.on("connection", function(ws) {
		ws.on("message", function(message) {
			message = JSON.parse(message);
			if(message.type == "registration") {
				clients.push({id: message.data, ws: ws});
				console.log("new client:", clients[clients.length - 1]);
			} else if(message.type == "startgame") {
				var gameID = Math.random().toString().substr(2);
				games[gameID] = {
					creator: message.data,
					enemy: null,
					state: true,
					turn: message.data,
					data: null
				};
				ws.send(JSON.stringify({
					type: "url",
					data: gameID
				}));
				console.log("new game: ", games[gameID]);
			}
		});
	});

app.get("/:id", function(req, res) {
	res.sendfile("public/online_index.html");
	var gameID = req.params.id;

	websocket.on("connection", function(ws) {
		ws.on("message", function(message) {
			message = JSON.parse(message);
			if(message.type == "ready") {
				if(!clients[message.data])
					clients[message.data] = ws;
				console.log("READY", message.data);
				if(games[gameID] && message.data != games[gameID].creator) {
					games[gameID].enemy = message.data;
					// clients[games[gameID].creator].send(JSON.stringify({
					// 	type: "attack",
					// 	data: {
					// 		x: 3,
					// 		y: 3
					// 	}
					// }));
				}
			} else if(message.type == "attack") {
				var player = null;
				
				clients[games[gameID].turn].send(JSON.stringify({
					type: "attack",
					data: {
						x: message.data.x,
						y: message.data.y
					}
				}));
				games[gameID].turn = games[gameID].turn == games[gameID].creator ?
									games[gameID].enemy : games[gameID].creator;
			}
		});
	});
});


app.listen(3000, function() {
	console.log("Server started at http://localhost:3000/");
});