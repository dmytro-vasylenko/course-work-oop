require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Draw: "Draw"
	}
});

require(["Cell", "Field", "Draw"], function(Cell, Field, Draw) {
	var field = new Field(10, 10);
	var draw = new Draw("canvas");
	draw.drawField(field, 0, 0);
});
