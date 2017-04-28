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

document.getElementById("bot-button").addEventListener("click", function() {
	document.getElementById("window").className += " fadeOut";
	document.getElementById("canvas-player").className += " fadeInLeft";
	document.getElementById("canvas-enemy").className += " fadeInRight";
	document.getElementById("window").style.zIndex = -10000;
});

require(["Player", "Boat"], function(Player, Boat) {
	var player = new Player("Dmitry", 10, 10, null, "canvas-player");
	player.init();
	player.canAttacked = false;
	player.generateBoats();
	player.giveAI();

	var enemy = new Player("Enemy", 10, 10, {
		onFieldClick: function() {
			player.botAttack();
		}
	}, "canvas-enemy");

	enemy.init();
	enemy.drawer.visible = false;
	enemy.generateBoats();
});
