// Game constants
const grid_size = 5; // 5x5 grid
const ship_length = 3; // # ship placements in grid

const HIT_UPPER_LIMIT = 5; // Max number of hits per player:5 ships
const MAX_TRIES_PER_PLAYER = 10; // Max number of tries per player:10

let playerOneScore = 0;
let playerOneClickCounter = 0; // total number of clicks per player irrespective of hit or miss

let playerTwoScore = 0;
let playerTwoClickCounter = 0;

let PLAYERS = {
  //defines an object called "PLAYERS" to store player names and scores
  1: "Player 1",
  2: "Player 2",
};

// Game state
let currentPlayer = 1; //declare variable of current player
let playerGrids = {
  //defines an object called "playerGrids" to store the grid cells of each player
  1: [],
  2: [],
};
let game_over = false; //declare variable of game over

// Create grid cells
function createGridCellsInDOM() {
  //function to create and append grid cells to the DOM
  const gridElement = document.getElementById("grid"); // this element represents the container where the grid cells will be appended.

  // First check if the GRID all ready has children, if yes then remove them

  while (gridElement.hasChildNodes()) {
    //first retrieves grid element and clears any existing grid cells.
    gridElement.removeChild(gridElement.firstChild);
  }

  // create the GRID elements

  for (let i = 0; i < grid_size; i++) {
    // ROW
    for (let j = 0; j < grid_size; j++) {
      // COL
      const cell = document.createElement("div"); //creates a new div element,which will represent a single grid cell.
      cell.className = "cell"; //the 'classname' property sets the CSS class of the "cell" element to each cell.
      cell.dataset.row = i; //dataset property sets the data attribute of the "cell" element to each cell.
      cell.dataset.col = j; //here row and col attributes are being set with values i and j respectively to retrieve position of cell in grid.

      //assigning event handler to cell
      cell.addEventListener("click", handleCellClick); //event listener is added to "cell" element listening for "click" event.
      //when cell is clicked "handleCellClick" function is called.
      gridElement.appendChild(cell); //appends the cell to the grid element.
      playerGrids[1].push(cell); //PlayerGrids array stores the grid cells for each player //pushes the cell to playerGrids[1]
      playerGrids[2].push(cell.cloneNode()); //clones the "cell"element using cloneNode() fn,thus each player has separate reference to grid cell.
    }
  }
}

// Event handler for cell click
function handleCellClick(event) {
  //defines handleCellClick function that serves as event handler for "click" event.
  const cell = event.target; //retrieves the clicked cell
  console.log(cell);

  const row = parseInt(cell.dataset.row); //extracts the row and column values from the dataset attributes of the clicked cell.
  const col = parseInt(cell.dataset.col); //parseint() converts extracted values from strings to integers.
  const playerGrid = playerGrids[currentPlayer]; //retrieves grid cells for current player from playergrids object based on current player.

  if (currentPlayer == 1) {
    playerOneClickCounter += 1; //these counters keep track of # of clicks per player regardless hit or miss, increments click counter for current player.
  } else {
    playerTwoClickCounter += 1;
  }

  if (
    playerGrid[row * grid_size + col].classList.contains("hit") ||
    playerGrid[row * grid_size + col].classList.contains("miss")
  ) {
    return; // Cell already attacked
  }
  //if cells has either hit or miss class it means that cell has already been attacked & function returns early and no further action take.
  //index of clicked cell in playergrid is calculated by row * grid_size + col.

  // Check if ship is hit
  if (cell.classList.contains("ship")) {
    //if clicked cell has ship class then it is hit.
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
    return; //checks if either player reached maximum score to declare winner
  }

  function declareWinner(currentPlayer) {
    alert(`Player ${currentPlayer} Won the game!!!`);
    resetGame();
  }
  // in 10 tries each, if both players have the same number of ships then declare game is a draw, if not declare game is a win
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
    resetGame(); //resets game state and ready for new gameplay!
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
  const playerGrid = playerGrids[player]; //represents grid of specific player.

  for (let ship = 0; ship < ship_length; ship++) {
    //loop is responsible for placing ships on players grid.
    const shipPosition = getRandomPosition(); //generates random position on grid

    // Check if ship position is already occupied
    if (playerGrid[shipPosition].classList.contains("ship")) {
      ship--; // Retry placing the ship
      continue; //proceeds to next iteration
    }

    // Place the ship TO DO //this code block proceeds if ship position is not occupied
    for (let i = 0; i < ship_length; i++) {
      const cell = playerGrid[shipPosition + i]; //access appropriate cell in playerGrid
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
