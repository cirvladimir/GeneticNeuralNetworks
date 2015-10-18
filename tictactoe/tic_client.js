// function pb () {
// 	for(var i = 0; i < 3; i++) {
// 		console.log(TICTACTOE.board[i][0]+ ' | ' + TICTACTOE.board[i][1] + " | " + TICTACTOE.board[i][2]);
// 	}
	
// }
window.onload = function() {
	drawBoard();
};

function drawBoard() {
	var canvas = document.getElementById('myCanvas');
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

var displayMark = {
	'p1': function(row, col) {
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(col*100 + 50, row*100 + 50, 40, 0, 2*Math.PI);
		ctx.stroke();
	},
	'p2': function(row, col) {
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext('2d');

		ctx.moveTo(col*100+10, row*100+10);
		ctx.lineTo((col+1)*100-10, (row+1)*100-10);
		ctx.stroke();

		ctx.moveTo((col+1)*100-10, row*100+10);
		ctx.lineTo(col*100+10, (row+1)*100-10);
		ctx.stroke();
	}
};
