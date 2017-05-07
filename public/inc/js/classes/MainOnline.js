require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Drawer: "Drawer",
		Player: "Player",
		Boat: "Boat",
		AI: "AI",
		WebSocket: "WebSocket"
	}
});


var gameID = window.location.href.substr(22);

require(["Player", "WebSocket"], function(Player, WS) {
	$("#canvas-player, #canvas-enemy").show();

	var player;
	var enemy;

	player = new Player("ВЫ", 10, 10, {
		loss: function() {
			player.canAttacked = false;
		},
		ws: new WS()
	}, "canvas-player");

	enemy = new Player("Враг", 10, 10, {
		gameType: "ONLINE",
		loss: function() {
			player.canAttacked = false;
		},
		ws: new WS()
	}, "canvas-enemy");

	var ws = new WS(player, enemy, function() {
		if(!$.cookie("user-id")) {
			var id = Math.random().toString().substr(2);
			$.cookie("user-id", id);
		}
		ws.send("registration", $.cookie("user-id"));
		ws.send("ready", {
			user: $.cookie("user-id"),
			game: gameID,
			cells: player.field.cells,
			boats: player.field.boats
		});
	});

	player.init();
	player.generateBoats();
	player.canAttacked = false;
	enemy.init();
	$("#reset-game").on("click", function() {
		player.reset();
		player.canAttacked = false;
		enemy.reset();
		$("#window-win").removeClass("fadeInDown");
		$("#window-win").addClass("fadeOut");
		$("#window-win").css({zIndex: -1000});
	});
});
