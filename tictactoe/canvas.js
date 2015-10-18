var generateCanvas = function(tictactoe) {
	var canvas = document.createElement("canvas");
	canvas.width = 300;
	canvas.height = 320;
	
	var displayMark = {
		'p1': function(row, col) {
			var ctx = canvas.getContext('2d');

			ctx.beginPath();
			ctx.arc(col*100 + 50, row*100 + 50, 40, 0, 2*Math.PI);
			ctx.stroke();
		},
		'p2': function(row, col) {
			var ctx = canvas.getContext('2d');

			ctx.moveTo(col*100+10, row*100+10);
			ctx.lineTo((col+1)*100-10, (row+1)*100-10);
			ctx.stroke();

			ctx.moveTo((col+1)*100-10, row*100+10);
			ctx.lineTo(col*100+10, (row+1)*100-10);
			ctx.stroke();
		}
	};

	function drawBoard() {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "silver";
		ctx.fillRect(0,0,300,300);

		ctx.moveTo(100,0);
		ctx.lineTo(100, 300);
		ctx.stroke();

		ctx.moveTo(200,0);
		ctx.lineTo(200, 300);
		ctx.stroke();

		ctx.moveTo(0,100);
		ctx.lineTo(300, 100);
		ctx.stroke();

		ctx.moveTo(0,200);
		ctx.lineTo(300, 200);
		ctx.stroke();	
	}

	function winMessage (msg) {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "black";
		ctx.lineWidth = 2;
		ctx.textAlign = "center";
		ctx.font = "16px Arial";
		ctx.fillText(msg, 250,318);

	}
	(function() {
		drawBoard();

		var id = tictactoe.id;
		if (id) {
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = "black";
			ctx.font = "16px Arial";
			ctx.fillText("X-id: "+id.Xid, "O-id: "+id.Oid, 10,318);
		}

		var board = tictactoe.board;

		for (var i = 0; i < board.length; i++) {
			var row = board[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === tictactoe.EMPTY) {
					continue;
				}

				displayMark['p'+row[j]](i, j);
			}
		};

		var winner = tictactoe.checkWinner();
		if (winner) {
			var player = (winner === 1) ? "O" : "X";
			winMessage("Winner "+ player);
		} else if (tictactoe.isFull()) {
			winMessage("Draw");
		}
	}());

	return canvas;
};

