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

require(["Player", "WebSocket"], function(Player, WS) {


	$("#canvas-player, #canvas-enemy").show();

	var player = new Player("Создатель", 10, 10, {
		loss: function() {
			player.canAttacked = false;
		}
	}, "canvas-player");

	var ws = new WS(player, function() {
		ws.send("ready", $.cookie("user-id"));
	});

	var enemy = new Player("Враг", 10, 10, {
		gameType: "ONLINE",
		loss: function() {
			player.canAttacked = false;
		},
		ws
	}, "canvas-enemy");


	player.init();
	player.generateBoats();
	player.canAttacked = false;
	enemy.init();

	var canRemove = true;

	$("#reset-game").on("click", function() {
		player.reset();
		player.canAttacked = false;
		enemy.reset();
		$("#window-win").removeClass("fadeInDown");
		$("#window-win").addClass("fadeOut");
		$("#window-win").css({zIndex: -1000});
	});

	$("#canvas-player").on("click", function() {
		if(canRemove) {
			player.reset();
			player.canAttacked = false;
		}
	});
});
