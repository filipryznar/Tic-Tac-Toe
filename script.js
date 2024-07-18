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
  let gameEnded = false;
  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    if (!gameEnded) {
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  };
  // determinig who wins
  const checkForWinner = () => {
    const boardArray = board.getBoard();
    for (let row = 0; row < 3; row++) {
      if (
        boardArray[row][0].getValue() !== 0 &&
        boardArray[row][0].getValue() === boardArray[row][1].getValue() &&
        boardArray[row][1].getValue() === boardArray[row][2].getValue()
      )
        return boardArray[row][0].getValue();
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        boardArray[0][col].getValue() != 0 &&
        boardArray[0][col].getValue() === boardArray[1][col].getValue() &&
        boardArray[1][col].getValue() === boardArray[2][col].getValue()
      )
        return boardArray[col][0].getValue();
    }
    // Check diagonal
    if (
      boardArray[0][0].getValue() != 0 &&
      boardArray[0][0].getValue() === boardArray[1][1].getValue() &&
      boardArray[1][1].getValue() === boardArray[2][2].getValue()
    ) {
      return boardArray[0][0].getValue();
    }
    if (
      boardArray[0][2].getValue() != 0 &&
      boardArray[0][2].getValue() === boardArray[1][1].getValue() &&
      boardArray[1][1].getValue() === boardArray[2][0].getValue()
    ) {
      return boardArray[0][2].getValue();
    }
    return null;
  };
  const playRound = (row, column) => {
    if (gameEnded) {
      console.log("The game has ended.");
      return;
    }
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

    // Check for winner
    const winner = checkForWinner();
    if (winner) {
      console.log(`${getActivePlayer().name} wins!`);
      gameEnded = true;
      game.board.printBoard();

      return;
    }

    // Switch player turn
    switchTurn();
    printNewRound();
  };

  return {
    getActivePlayer,
    playRound,
    board,
  };
}

function screenController() {
  const updateScreen = 0;
}

const game = gameController();
