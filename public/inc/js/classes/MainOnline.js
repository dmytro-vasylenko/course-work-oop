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
	setTimeout(function() {
		$("#canvas-player").removeClass("fadeInLeft").css({"display": "block", "opacity": 1});
		$("#canvas-enemy").removeClass("fadeInRight").css({"display": "block", "opacity": 1});
	}, 1000);

	if($.cookie("creator")) {
		$("#window-welcome input").val(window.location.href);
		$("#window-welcome").show();
		$.cookie("cireator", false);
	}

	var player;
	var enemy;

	player = new Player(10, 10, {
		loss: function() {
			player.canAttacked = false;
		}
	}, "canvas-player", "Вы проиграли!");

	enemy = new Player(10, 10, {
		gameType: "ONLINE",
		loss: function() {
			player.canAttacked = false;
		}
	}, "canvas-enemy", "Вы выиграли!");

	var ws = new WS(player, enemy, function() {
		if(!$.cookie("user-id")) {
			var id = Math.random().toString().substr(2);
			$.cookie("user-id", id);
		} else {

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
	$("#ok-button").on("click", function() {
		$("#window-welcome").fadeOut();
	});
});
