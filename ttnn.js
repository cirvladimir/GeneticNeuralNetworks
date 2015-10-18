var NUM_GAMES = 3;

var nns = Array.range(1<<NUM_GAMES).map(generateNetwork.bind(null, 4, 9, 9));

var games = Array.range(nns.length).map(generateTictactoe);
var victories = games.map(function() { return -1; });
var gamesDiv;

var runFast = false;

var moveNum = 0;

// (ზ = function() {
var oneStepMove = function() {
	// if (!runFast)
		gamesDiv.innerHTML = "";
	// play a step
	games.forEach(function(game, ind) {
		if (victories[ind] == -1) {
			var outp = runNetwork(nns[ind], game.board.flatten().map(function(x) { return x == 0 ? 0.5 : (x == game.player) ? 0 : 1; }));
			var bestVal = null;
			var bestMove = null;
			game.board.flatten().forEach(function(move, sqInd) {
				if (move == game.EMPTY) {
					if ((bestMove == null) || (bestVal < outp[sqInd])) {
						bestMove = sqInd;
						bestVal = outp[sqInd];
					}
				}
			});
			game.markSlot(Math.floor(bestMove / 3), bestMove % 3);
			var victory = game.checkWinner();
			if (victory) {
				victories[ind] = 9;//you're good
			} else if (game.isFull()) {
				victories[ind] = 8;//Tied is good enough
			} else {
				// move computer
				game.switchPlayer();
				game.makeMove();
				if (game.checkWinner()) {
					victories[ind] = moveNum;
				}
				game.switchPlayer();
			}
		}
		// if (!runFast)
		gamesDiv.appendChild(generateCanvas(game, nns[ind].color, 255));
	});
	moveNum++;
	// if done
	if (!victories.some(function(v) { return v == -1; })) {
		// kill loosers
		var worst = victories.map(_);
		worst.sort();
		worst.slice(0, worst.length / 2).forEach(function(score) {
			var ind = victories.indexOf(score);
			victories[ind] = null;
			nns[ind] = null;
		});
		nns = nns.filter(_);
		// victories.forEach(function(vic, ind) {
		// 	nns.splice(ind + vic, 1);
		// });
		// if down to two
		if (nns.length <= 2) {
			// reproduce
			nns = nns.map(function(surviver) {
				return Array.range((1 << (NUM_GAMES - 1)) - 1).map(mutateNetwork.bind(null, surviver)).concat([surviver]);
			}).flatten();	
			// restart
			nns = nns.shuffle();
			games = Array.range(nns.length).map(generateTictactoe);
			victories = games.map(function() { return -1; });
		} else {
			nns = nns.shuffle();
			games = Array.range(nns.length).map(generateTictactoe);
			victories = games.map(function() { return -1; });
		}
		moveNum = 0;
	}
};

window.addEventListener("load", function() {
	gamesDiv = document.querySelector("#games");
	document.querySelector("#step").addEventListener("click", oneStepMove);
	var running = false;
	document.querySelector("#continuous").addEventListener("click", function() {
		running = !running;
		if (running) {
			var runTimeout = function() {
				oneStepMove();
				if (running)
					setTimeout(runTimeout, runFast ? 10 : 300);	
			};
			runTimeout();
		}
		document.querySelector("#continuous").innerHTML = running ? "Stop" : "Run";
	});
	document.querySelector("#fast").addEventListener("change", function() {
		runFast = document.querySelector("#fast").checked;
	});
});

// ზ();
