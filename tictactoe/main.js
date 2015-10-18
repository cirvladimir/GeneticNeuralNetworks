var generateTictactoe = function(Xid, Oid){
	var m = {};
	var BOARD_SIZE = 3;

	if (Xid && Oid) {m.id = {'Xid': Xid, 'Oid':Oid}};
	m.PLAYERS = {
		'p1': 1,
		'p2': 2
	};
	m.EMPTY = 0;
	m.NO_WINNER = 0;

	m.board = initBoard();
	m.player = m.PLAYERS.p1;

	m.markSlot = function(row, col) {
		if ((row >= BOARD_SIZE) || (row < 0) || (col >= BOARD_SIZE) || (col < 0)) {
			throw "Stupid index!!!";
		} else if (m.board[row][col] === m.EMPTY) {
			m.board[row][col] = m.player;
			return true;
		} else {
			return false;
		}
	};

	m.resetBoard = function() {
		m.board = initBoard();
	};

	m.isFull = function() {
		for (var i = 0; i < m.board.length; i++) {
			var row = m.board[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === m.EMPTY) {
					return false;
				}
			}
		}

		return true;
	};

	m.checkWinner = function() {
		return checkVertical() || checkHorizontal() || checkDiagonal();
	};

	m.switchPlayer = function() {
		m.player = (m.player === m.PLAYERS.p1) ? m.PLAYERS.p2 : m.PLAYERS.p1;
	};

	m.makeMove = function() {
		var movesLeft = 0;
		for (var r = 0; r < 3; r++) {
			for (var c = 0; c < 3; c++) {
				if (m.board[r][c] == m.EMPTY)
					movesLeft++;
			}
		}
		var recFunc = function(mLeft) {
			var best = [null, null, null];
			for (var r = 0; r < 3; r++) {
				for (var c = 0; c < 3; c++) {
					if (m.board[r][c] == m.EMPTY) {
						m.board[r][c] = m.player;
						if (m.checkWinner()) {
							m.board[r][c] = m.EMPTY;
							return [r,c,1];
						}
						if (mLeft == 1) {
							m.board[r][c] = m.EMPTY;
							return [r,c,0];
						}
						m.switchPlayer();
						var vals = recFunc(mLeft - 1);
						if (best[2] == null || -vals[2] > best[2]) {
							best = vals;
						}
						m.switchPlayer();
						m.board[r][c] = m.EMPTY;
					}
				}
			}
			return best;
		};
		var bestMove = recFunc(movesLeft);
		m.markSlot(bestMove[0], bestMove[1]);
	};

	function initBoard() {
		return [
			[m.EMPTY, m.EMPTY, m.EMPTY],
			[m.EMPTY, m.EMPTY, m.EMPTY],
			[m.EMPTY, m.EMPTY, m.EMPTY]
		];
	}

	// return winner if there's one, otherwise return 0
	function checkVertical() {
		var counter = 0;
		for (var col = 0; col < BOARD_SIZE; col++) {
			for (var row = 0; row < BOARD_SIZE; row++) {
				if (m.board[row][col] === m.EMPTY) {
					break;
				}

				m.board[row][col] === m.PLAYERS.p1 ? counter++: counter--;
			}

			if (counter === 3 || counter === -3) {
				return (counter===3)? m.PLAYERS.p1: m.PLAYERS.p2;
			}

			counter = 0;
		}

		return m.NO_WINNER;
	}

	// return winner if there's one, otherwise return 0
	function checkHorizontal() {
		var counter = 0;
		for (var row = 0; row < BOARD_SIZE; row++) {
			for (var col = 0; col < BOARD_SIZE; col++) {
				if (m.board[row][col] === m.EMPTY) {
					break;
				}

				m.board[row][col] === m.PLAYERS.p1 ? counter++: counter--;
			}

			if (counter === 3 || counter === -3) {
				return (counter===3)? m.PLAYERS.p1: m.PLAYERS.p2;
			}

			counter = 0;
		}

		return m.NO_WINNER;
	}

	// return winner if there's one, otherwise return 0
	function checkDiagonal() {
		if((m.board[0][0] === m.board[1][1] && m.board[1][1] === m.board[2][2] && m.board[2][2] != m.EMPTY)) {
			return m.board[0][0];
		} else if(m.board[0][2] === m.board[1][1] && m.board[1][1] === m.board[2][0] && m.board[2][0] != m.EMPTY) {
			return m.board[0][2];
		} else {
			return m.NO_WINNER;
		}
	}

	return m;
};