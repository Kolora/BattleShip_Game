// Game constants
const grid_size = 5; // 5x5 grid
const ship_length = 3; // # length of ship

const HIT_UPPER_LIMIT = 5; // Max number of hits per player:5 ships, if no hits then game is over
const MAX_TRIES_PER_PLAYER = 10; // Max number of tries per player:10

let playerOneScore = 0;
let playerOneClickCounter = 0; // total number of clicks per player irrespective of hit or miss

let playerTwoScore = 0;
let playerTwoClickCounter = 0;

let PLAYERS = {
  1: "Player 1",
  2: "Player 2",
};

// Game state
let currentPlayer = 1;
let playerGrids = {
  1: [],
  2: [],
};

let game_over = false;

// Create grid cells
function createGridCellsInDOM() {
  const gridElement = document.getElementById("grid");

  // First check if the GRID all ready has children, if yes then remove them

  while (gridElement.hasChildNodes()) {
    gridElement.removeChild(gridElement.firstChild);
  }

  // create the GRID elements

  for (let i = 0; i < grid_size; i++) {
    // ROW
    for (let j = 0; j < grid_size; j++) {
      // COL
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick); //assigning event handler to cell
      gridElement.appendChild(cell);
      playerGrids[1].push(cell);
      playerGrids[2].push(cell.cloneNode());
    }
  }
}

// Event handler for cell click
function handleCellClick(event) {
  const cell = event.target;
  console.log(cell);

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const playerGrid = playerGrids[currentPlayer];

  if (currentPlayer == 1) {
    playerOneClickCounter += 1; //based on the number of clicks per player hit or miss
  } else {
    playerTwoClickCounter += 1;
  }

  if (
    playerGrid[row * grid_size + col].classList.contains("hit") ||
    playerGrid[row * grid_size + col].classList.contains("miss")
  ) {
    return; // Cell already attacked
  }

  // Check if ship is hit
  if (cell.classList.contains("ship")) {
    cell.classList.add("hit");
    if (String(PLAYERS[currentPlayer]) == "Player 1") {
      cell.classList.add("player_1_cell");
      cell.innerText = "🚢";
      increaseScores(currentPlayer);
    } else {
      cell.classList.add("player_2_cell");
      increaseScores(currentPlayer);
      cell.innerText = "⛵";
    }
    alert(`${PLAYERS[currentPlayer]} hit a ship!`);
  } else {
    cell.classList.add("miss");
    cell.style.backgroundColor = "red";
    alert(`${PLAYERS[currentPlayer]} missed.`);
  }

  if (playerOneScore == HIT_UPPER_LIMIT || playerTwoScore == HIT_UPPER_LIMIT) {
    declareWinner(currentPlayer);
    return;
  }

  function declareWinner(currentPlayer) {
    alert(`Player ${currentPlayer} Won the game!!!`);
    resetGame();
  }
  // if both players have the same number of ships then declare game is a draw, if not declare game is a win
  if (
    playerOneClickCounter == MAX_TRIES_PER_PLAYER &&
    playerTwoClickCounter == MAX_TRIES_PER_PLAYER
  ) {
    let winner = undefined;
    let isDraw = false;
    if (playerOneScore > playerTwoScore) {
      winner = "Player 1";
    } else if (playerTwoScore > playerOneScore) {
      winner = "Player 2";
    } else {
      isDraw = true;
    }
    alert(
      `Chances are over! ${
        isDraw ? "Game is a draw !!!" : `Winner is ${winner}`
      }`
    );
    resetGame();
  }
  // Switch to the next player
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  check_for_game_end_state();
}

//Game end state
function check_for_game_end_state() {
  let main_grid = document.getElementById("grid");
  if (
    Array.from(main_grid.children).every(
      (child) =>
        child.classList.contains("hit") || child.classList.contains("miss")
    )
  ) {
    game_over = true;
    alert("Game Over !!!");
    resetGame();
  }
}

//increment of scores
function increaseScores(currentPlayer) {
  if (currentPlayer == 1) {
    playerOneScore += 1;
  } else {
    playerTwoScore += 1;
  }
  updateScoreInDOM(currentPlayer);
}

//update scores
function updateScoreInDOM(currentPlayer) {
  if (currentPlayer == 1) {
    playerOneScoreCard.innerText = `Player 1 Score: ${playerOneScore}`;
  } else {
    playerTwoScoreCard.innerText = `Player 2 Score: ${playerTwoScore}`;
  }
}

createGridCellsInDOM();
// Randomly place ships for each player
placeShips(1);
placeShips(2);

// Function to randomly place ships for a player
function placeShips(player) {
  const playerGrid = playerGrids[player];

  for (let ship = 0; ship < ship_length; ship++) {
    const shipPosition = getRandomPosition();

    // Check if ship position is already occupied
    if (playerGrid[shipPosition].classList.contains("ship")) {
      ship--; // Retry placing the ship
      continue;
    }

    // Place the ship TO DO
    for (let i = 0; i < ship_length; i++) {
      const cell = playerGrid[shipPosition + i];
      cell.classList.add("ship");
    }
  }
}

// Function to get a random position on the grid
function getRandomPosition() {
  return Math.floor(Math.random() * (grid_size * grid_size - ship_length + 1));
}

// place the player scores in the dom

let playerOneScoreCard = document.getElementById("PlayerOneScore");
let playerTwoScoreCard = document.getElementById("PlayerTwoScore");

updateScoreInDOM(1);
updateScoreInDOM(2);

//game resets
function resetGame() {
  currentPlayer = 1;
  // resetting all the dynamic variables
  playerGrids = {
    1: [],
    2: [],
  };

  playerOneScore = 0;
  playerTwoScore = 0;
  playerOneClickCounter = 0;
  playerTwoClickCounter = 0;

  createGridCellsInDOM();

  placeShips(1);
  placeShips(2);

  updateScoreInDOM(1);
  updateScoreInDOM(2);
}
