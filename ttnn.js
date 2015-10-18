var NUM_GAMES = 4;

var nns = Array.range(1<<NUM_GAMES).map(generateNetwork.bind(null, 4, 9, 9));

var games = Array.range(nns.length / 2).map(generateTictactoe);
var victories = games.map(function() { return -1; });
var gamesDiv;

var toColor = function(c) { return "rgb(" + (c >> 16) + "," + ((c >> 8) % 256) + "," + (c % 256) + ")"; }

// (ზ = function() {
var oneStepMove = function() {
	gamesDiv.innerHTML = "";
	// play a step
	games.forEach(function(game, ind) {
		if (victories[ind] == -1) {
			var outp = runNetwork(nns[ind * 2 + (game.player % 2)], game.board.flatten().map(function(x) { return x == 0 ? 0.5 : (x == game.player) ? 0 : 1; }));
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
				victories[ind] = victory % 2;
			} else if (game.isFull()) {
				victories[ind] = 1; // Arbitrary say 1 wins
			}
		}
		game.switchPlayer();
		gamesDiv.appendChild(generateCanvas(game, toColor(nns[ind * 2].color), toColor(nns[ind * 2 + 1].color)));
	});
	// if done
	if (!victories.some(function(v) { return v == -1; })) {
		// kill loosers
		victories.forEach(function(vic, ind) {
			nns.splice(ind + vic, 1);
		});
		// if down to two
		if (nns.length == 2) {
			// reproduce
			nns = nns.map(function(surviver) {
				return Array.range((1 << (NUM_GAMES - 1)) - 1).map(mutateNetwork.bind(null, surviver)).concat([surviver]);
			}).flatten();	
			// restart
			nns = nns.shuffle();
			games = Array.range(nns.length / 2).map(generateTictactoe);
			victories = games.map(function() { return -1; });
		} else {
			nns = nns.shuffle();
			games = Array.range(nns.length / 2).map(generateTictactoe);
			victories = games.map(function() { return -1; });
		}
	}
};

window.addEventListener("load", function() {
	gamesDiv = document.querySelector("#games");
	document.body.addEventListener("click", oneStepMove);
});


// Array.range(NUM_GAMES - 1).forEach(function() {
// 	nns = nns.shuffle();
// 	var games = Array.range(nns.length / 2).map(generateTictactoe);
// 	var victories = games.map(function() { return 0; });
// 	// play game
// 	while (victories.some(function(v) { return v == 0; })) {
// 		// play step for unfinished games
// 		games.forEach(function(game, ind) {
// 			if (victories[ind] == 0) {
// 				var outp = runNetwork(nns[ind * 2 + (game.player % 2)], game.board.flatten().map(function(x) { return x == 0 ? 0.5 : (x == game.player) ? 0 : 1; }));
// 				var bestVal = null;
// 				var bestMove = null;
// 				game.board.flatten().forEach(function(move, sqInd) {
// 					if (move == game.EMPTY) {
// 						if ((bestMove == null) || (bestVal < outp[sqInd])) {
// 							bestMove = sqInd;
// 							bestVal = outp[sqInd];
// 						}
// 					}
// 				});
// 				game.markSlot(Math.floor(bestMove / 3), bestMove % 3);
// 				var victory = game.checkWinner();
// 				if (victory) {
// 					victories[ind] = victory % 2;
// 				} else if (game.isFull()) {
// 					victories[ind] = 1; // Arbitrary say 1 wins
// 				}
// 			}
// 		});
// 	}
// 	// kill loosers
// 	victories.forEach(function(vic, ind) {
// 		nns.splice(ind + vic, 1);
// 	});
// });
// // reproduce
// nns = nns.map(function(surviver) {
// 	return Array.range((1 << (NUM_GAMES - 1)) - 1).map(mutateNetwork.bind(null, surviver).concat([surviver]);
// }).flatten();

// ზ();
// })();
