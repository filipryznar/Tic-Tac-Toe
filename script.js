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
    if (board[row][column].getValue() !== "") {
      console.log("Invalid move: Cell is already occupied.");
      return;
    }
    board[row][column].addToBoard(player);
  };
  return { getBoard, printBoard, makeMove, getValue };
}

function Cell() {
  let value = "";
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
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
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
        boardArray[row][0].getValue() !== "" &&
        boardArray[row][0].getValue() === boardArray[row][1].getValue() &&
        boardArray[row][1].getValue() === boardArray[row][2].getValue()
      )
        return [
          [row, 0],
          [row, 1],
          [row, 2],
        ]; // Return winning row
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        boardArray[0][col].getValue() != "" &&
        boardArray[0][col].getValue() === boardArray[1][col].getValue() &&
        boardArray[1][col].getValue() === boardArray[2][col].getValue()
      )
        return [
          [0, col],
          [1, col],
          [2, col],
        ]; // Return winning column
    }
    // Check diagonals
    if (
      boardArray[0][0].getValue() !== "" &&
      boardArray[0][0].getValue() === boardArray[1][1].getValue() &&
      boardArray[1][1].getValue() === boardArray[2][2].getValue()
    ) {
      return [
        [0, 0],
        [1, 1],
        [2, 2],
      ]; // Return winning diagonal
    }
    if (
      boardArray[0][2].getValue() !== "" &&
      boardArray[0][2].getValue() === boardArray[1][1].getValue() &&
      boardArray[1][1].getValue() === boardArray[2][0].getValue()
    ) {
      return [
        [0, 2],
        [1, 1],
        [2, 0],
      ]; // Return winning diagonal
    }

    return null;
  };

  const checkForTie = () => {
    const boardArray = board.getBoard();
    // if (winner !== null) {
    //   return false; // there is a winner no a tie
    // }
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (boardArray[row][col].getValue() === "") {
          return false; // if ther is empty cell its not a tie
        }
      }
    }

    return true; // If there is no empty cell it is a tie
  };

  const playRound = (row, column) => {
    if (gameEnded) {
      console.log("The game has ended.");
      return;
    }
    if (board.getValue(row, column) !== "") {
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
      board.printBoard();

      return;
    }
    // Check for TIE
    const tie = checkForTie();
    if (tie) {
      console.log(`It's a TIE!`);
      gameEnded = true;
      board.printBoard();
      return;
    }

    // Switch player turn
    switchTurn();
    printNewRound();
  };
  const isGameEnded = () => gameEnded;
  return {
    getActivePlayer,
    playRound,
    board,
    checkForTie,
    checkForWinner,
    isGameEnded,
  };
}

function ScreenController() {
  let game = gameController();
  const playerTurnDiv = document.querySelector(".info");
  const boardDiv = document.querySelector(".grid");
  const newGameButton = document.createElement("button");
  newGameButton.textContent = "New Game";

  // Add event listenter to newGameButton
  newGameButton.addEventListener("click", () => {
    game = gameController();
    updateScreen();
  });

  const updateScreen = () => {
    boardDiv.innerHTML = ""; // Clear the board
    // Get the newest version of board and players turn
    const board = game.board.getBoard();
    const activePlayer = game.getActivePlayer();
    const winnerCombination = game.checkForWinner(); // Get winning combination
    const tie = game.checkForTie();
    const gameEnded = game.isGameEnded();
    // Display players turn
    if (gameEnded) {
      if (winnerCombination) {
        playerTurnDiv.textContent = `${activePlayer.name} WON`;
      } else if (tie) {
        playerTurnDiv.textContent = `IT'S A TIE!`;
      } else {
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
      }
      playerTurnDiv.appendChild(newGameButton); // Append "New Game" button only once
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    }

    // Renden board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        // Anything clickable will be button
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        // Create atribute to indetify the column and row
        cellButton.dataset.column = index;
        cellButton.dataset.row = rowIndex;

        cellButton.textContent = cell.getValue();
        // Apply winning class if part of the winning combination
        if (
          winnerCombination &&
          winnerCombination.some(
            (pos) => pos[0] === rowIndex && pos[1] === index
          )
        ) {
          cellButton.classList.add("winning");
        }

        cellButton.addEventListener("click", (e) => {
          const selectedColumn = parseInt(e.target.dataset.column);
          const selectedRow = parseInt(e.target.dataset.row);
          game.playRound(selectedRow, selectedColumn);
          updateScreen();
        });

        boardDiv.appendChild(cellButton);
      });
    });
  };
  updateScreen();
}
ScreenController();
