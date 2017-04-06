require.config({
	baseUrl: "inc/js/classes/",
	paths: {
		Cell: "Cell",
		Field: "Field",
		Draw: "Draw"
	}
});

require(["Cell", "Field"], function(Cell, Field) {
	var field = new Field(10, 10);
	console.log(field.cells);
});
