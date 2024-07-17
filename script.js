// Creating gameboard
function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];
  //create game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };
  const getValue = (row, column) => board[row][column].getValue();

  const getBoard = () => board;
  const makeMove = (row, column, player) => {
    // if cell make it through filter, valid move
    if (board[row][column].getValue() !== 0) {
      console.log("Invalid move: Cell is already occupied.");
      return;
    }
    board[row][column].addToBoard(player);
  };
  return { getBoard, printBoard, makeMove, getValue };
}

function Cell() {
  let value = 0;
  // Method accepst player paramater and assigns it to value
  const addToBoard = (player) => {
    value = player;
  };

  // Method returns current state of the cell, its value
  const getValue = () => value;

  return {
    addToBoard,
    getValue,
  };
}

// Fuction that controls flow of the game
function gameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = GameBoard();
  const players = [
    { name: playerOneName, token: 1 },
    { name: playerTwoName, token: 2 },
  ];
  let activePlayer = players[0];
  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };
  const playRound = (row, column) => {
    if (board.getValue(row, column) !== 0) {
      console.log("Invalid move: Cell is already occupied. Try again");
      return;
    }
    // Current player will make a move
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into row ${row} and column ${column} `
    );
    board.makeMove(row, column, getActivePlayer().token);

    // Switch player turn
    switchTurn();
    printNewRound();
  };

  return {
    getActivePlayer,
    playRound,
  };
}

const game = gameController();

// Check for win
function checkForWin(game) {}
//create player

// create game
// create fuction that displays player move
