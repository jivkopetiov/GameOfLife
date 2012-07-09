var GameOfLife = function() {
	var canvas,
		matrix = [],
		neighbours = [],
		ctx,
		playTimeout,
		numberOfRandomItems = 500,
		playDelay = 300, // in milliseconds

	render = function(canvasId) {
		canvas = $(canvasId)[0]; 
		ctx = canvas.getContext("2d");
		
		for(var i = 0; i < 60; i++)  {
			neighbours[i] = [];
			matrix[i] = [];
		}
		
		drawRandomItems(numberOfRandomItems);
		
		$("#move").click(function() {
			iteration();
		});
		
		$("#play").click(function() {
			if ($(this).text() === "Play") {
				$(this).text("Pause");
				iteration();
				play();
			}
			else {
				$(this).text("Play");
				if (playTimeout)
					clearTimeout(playTimeout);
			}
		});
		
		$("#newRandomBoard").click(function(e) {
			if ($($("#play")).text() === "Pause")
				$("#play").text("Play");
				
			if (playTimeout)
				clearTimeout(playTimeout);
				
			clearMatrix();
			drawRandomItems(numberOfRandomItems);
		});
		
		$("#newEmptyBoard").click(function(e) {
			if ($($("#play")).text() === "Pause")
				$("#play").text("Play");
				
			if (playTimeout)
				clearTimeout(playTimeout);
				
			clearMatrix();
		});
		
		canvas.addEventListener('click', function(e) {
			if ($("#play").text() === "Pause")
				return;
			
			var item = getClickedItem(e);

			if (matrix[item.x][item.y])
				removeItem(item.x, item.y);
			else
				addItem(item.x, item.y);
		});
	},

	getClickedItem = function(e) {
		var x;
		var y;
		if (e.pageX || e.pageY) { 
		  x = e.pageX;
		  y = e.pageY;
		}
		else { 
		  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
		} 
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		
		x = Math.floor(x / 10);
		y = Math.floor(y / 10);
		
		return { x: x, y: y };
	},

	drawRandomItems = function(count) {
		
		for(var counter = 0; counter < count; counter++) {
			var x = Math.floor((Math.random() * 59));
			var y = Math.floor((Math.random() * 59));
			addItem(x, y);
		}
	},

	addItem = function(x, y) {
		ctx.fillStyle = "Blue";
		matrix[x][y] = true;
		ctx.fillRect(x * 10, y * 10, 10, 10);
	},

	removeItem = function(i, j) {
		ctx.fillStyle = 'LightGrey';
		matrix[i][j] = false;
		ctx.fillRect(i * 10, j * 10, 10, 10);
	},

	clearMatrix = function() {
		
		for(var i = 0; i < 60; i++)  {
			for(var j = 0; j < 60; j++) {
				if (matrix[i][j]) {
					removeItem(i, j);
				}
			}
		}
	},

	play = function() {
		playTimeout = setTimeout(function() {
			iteration();
			play();
		}, playDelay);
	},

	iteration = function() {
		for(var i = 0; i < 60; i++)  {
			for(var j = 0; j < 60; j++) {
				var neigh = getNeighbours(i,j);
				neighbours[i][j] = neigh;
			}
		}

		var removes = [];
		var promotes = [];
		
		for(var i = 0; i < 60; i++)  {
			for(var j = 0; j < 60; j++) {
				if (matrix[i][j]) {
					var neigh = neighbours[i][j];
					if (neigh < 2 || neigh > 3)
						removes.push({ i: i, j:j });
				}
				else {
					if (neighbours[i][j] === 3)
						promotes.push({ i: i, j:j });
				}
			}
		}
		
		ctx.fillStyle = 'LightGrey';
		$.each(removes, function(i, remove) {
			var i = remove.i;
			var j = remove.j;
			matrix[i][j] = false;
			ctx.fillRect(i * 10, j * 10, 10, 10);
		});
		
		ctx.fillStyle = 'Blue';
		$.each(promotes, function(i, promote) {
			var i = promote.i;
			var j = promote.j;
			matrix[i][j] = true;
			ctx.fillRect(i * 10, j * 10, 10, 10);
		});
	},

	getNeighbours = function(i,j) {
		var result = 0;
		if (i > 0) {
			if (matrix[i-1][j]) result++;
			if (j>0 && matrix[i-1][j-1]) result++;
		}
		
		if (j > 0) {
			if (matrix[i][j-1])	result++;
			if (i < 59 && matrix[i+1][j-1]) result++;
		}
		
		if (i < 59 && matrix[i+1][j]) result++;
		
		if (i>0 && j<59 && matrix[i-1][j+1]) result++;
		
		if (i<59 && j<59 && matrix[i+1][j+1]) result++;
		
		if (j<59 && matrix[i][j+1]) result++;
		
		return result;
	};

	return {
		render: render
	};
}();