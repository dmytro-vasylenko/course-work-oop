require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Drawer: "Drawer",
		Player: "Player",
		Boat: "Boat",
		AI: "AI"
	}
});

require(["Player", "Boat"], function(Player, Boat) {

	var player;
	var enemy;


	$("#bot-button").on("click", function() {
		$("#window-welcome").addClass("fadeOut");
		$("#canvas-player").show().addClass("fadeInLeft");
		$("#canvas-enemy").show().addClass("fadeInRight");
		$("#window-welcome").css({zIndex: -1000});

		player = new Player($("#window-welcome input").val(), 10, 10, null, "canvas-player");
		player.init();
		player.canAttacked = false;
		player.generateBoats();
		player.giveAI();

		enemy = new Player("Бот", 10, 10, {
			onFieldClick: function() {
				player.botAttack();
			},
			loss: function() {
				player.canAttacked = false;
			}
		}, "canvas-enemy");

		enemy.init();
		enemy.drawer.visible = false;
		enemy.generateBoats();

		// console.log(player.printField());
	});
	$("#reset-game").on("click", function() {
		player.reset();
		player.canAttacked = false;
		enemy.reset();
		$("#window-win").removeClass("fadeInDown");
		$("#window-win").addClass("fadeOut");
		$("#window-win").css({zIndex: -1000});
	});
});
