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

	var player;
	var enemy;

	var canRemove = true;
	var ws = new WS();

	$("#bot-button").on("click", function() {
		$("#window-welcome").addClass("rotateOut");
		$("#canvas-player").show().addClass("fadeInLeft");
		$("#canvas-enemy").show().addClass("fadeInRight");
		setTimeout(function() {
			$("#canvas-player").removeClass("fadeInLeft").css({"display": "block", "opacity": 1});
			$("#canvas-enemy").removeClass("fadeInRight").css({"display": "block", "opacity": 1});
		}, 1000);
		$("#window-welcome").css({zIndex: -1000});

		player = new Player(10, 10, {
			gameType: "BOT",
		}, "canvas-player", "Вы проиграли!");
		player.init();
		player.canAttacked = false;
		player.generateBoats();
		player.giveAI();


		enemy = new Player(10, 10, {
			gameType: "BOT",
			onFieldClick: function() {
				player.botAttack();
				canRemove = false;
			},
			loss: function() {
				player.canAttacked = false;
			}
		}, "canvas-enemy", "Вы выиграли!");

		enemy.init();
		enemy.drawer.visible = false;
		enemy.generateBoats();
	});

	$("#friend-button").on("click", function() {
		if(!$.cookie("user-id")) {
			var id = Math.random().toString().substr(2);
			$.cookie("user-id", id);
		}
		$.cookie("creator", true);
		ws.send("registration", $.cookie("user-id"));
		ws.send("startgame", $.cookie("user-id"));
	});

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
			canRemove = true;
		}
	});
});
