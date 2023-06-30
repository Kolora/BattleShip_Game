//Game Strategy

//row*column=5*5
//player 1 and 2 scores board to display scores
//if player 1 hits display green and if player 2 hits display yellow and if any player missed display red
//Game over or tie state?  display winner

//Game Variables

const grid_size = 5; //5 rows and columns
const ship_length = 3; //# of ships in grid
const Players = { 1: "Player1", 2: "Player2" }; //number of players

//State of the game
let playerOneScore = 0;
let playerOneClickCounter = 0;

let playerTwoScore = 0;
let playerTwoClickCounter = 0;

let CurrentPlayer = 1;
let playerGrids = { 1: [], 2: [] }; //Array of cells (empty state)
let game_over = false;
let scores = { 1: 0, 2: 0 }; //player 1 and 2 scores board
let playerColors = { 1: "blue", 2: "red" };

console.log("check_1");

//Create grid cells
function createGridCellsInDOM() {
  console.log("check_2");

  const gridElements = document.getElementById("grid");
  // First check if the GRID all ready has children, if yes then simply remove them

  while (gridElements.hasChildNodes()) {
    gridElements.removeChild(gridElements.firstChild);
  }
  console.log("check_3");

  //create grid elements
  for (let i = 0; i < grid_size; i++) {
    console.log("check_4");

    //create row
    for (let j = 0; j < grid_size; j++) {
      console.log("check_5");

      //create column
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleClick); //function to invoke
      gridElements.appendChild(cell);
      playerGrids[1].push(cell);
      playerGrids[2].push(cell.cloneNode());
      console.log("am_i_being_Called", cell);
      // if (CurrentPlayer == 1) {
      //   cell.style.backgroundColor = playerColors[1];
      // } else {
      //   cell.style.backgroundColor = playerColors[2];
      // }
    }
  }

  //check for game end state
  function game_state() {
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

  function updateScoreInDOM(CurrentPlayer) {
    if (CurrentPlayer === 1) {
      playerOneScoreCard.innerText = `Player 1 Score:${playerOneScore}`;
    } else {
      playerTwoScoreCard.innerText = `Player 2 Score:${playerTwoScore}`;
    }
  }

  function increaseScores(currentPlayer) {
    if (currentPlayer == 1) {
      playerOneScore += 1;
    } else {
      playerTwoScore += 1;
    }
    updateScoreInDOM(currentPlayer);
  }

  function declareWinner(currentPlayer) {
    alert(`Player ${currentPlayer} Won the game!!!`);
    resetGame();
  }

  // Event handler for cell click
  function handleClick(e) {
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const playerGrid = playerGrids[CurrentPlayer];

    if (CurrentPlayer == 1) {
      playerOneClickCounter += 1;
    } else {
      playerTwoClickCounter += 1;
    }

    if (
      playerGrid[row * grid_size + col].classList.contains("hit") ||
      playerGrid[row * grid_size + col].classList.contains("miss")
    ) {
      return; // Cell already attacked
    }

    //check if ship is hit
    const hitImage = document.createElement("img"); //add image
    hitImage.src = "titanic.png";
    hitImage.classList.add("hit-image");

    if (cell.classList.contains("ship")) {
      cell.classList.add("hit");
      // cell.style.backgroundColor = "green";
      if (String(Players[CurrentPlayer]) == "Player 1") {
        cell.classList.add("player_1_cell");
        increaseScores(CurrentPlayer);
      } else {
        cell.classList.add("player_2_cell");
        increaseScores(CurrentPlayer);
      }

      alert(`${Players[CurrentPlayer]} hit a ship!`);
      cell.appendChild(hitImage);
      scores[CurrentPlayer]++; //increment scores for current player
      showMessage(`Player ${CurrentPlayer}: Hit!`, playerColors[CurrentPlayer]);
    } else {
      cell.classList.add("miss");
      cell.style.backgroundColor = playerColors[CurrentPlayer]; //use players color to miss
      showMessage(
        `Player ${CurrentPlayer}: Miss!`,
        playerColors[CurrentPlayer]
      );
    }
    // alert(`${Players[CurrentPlayer]} missed.`);
  }

  if (playerOneScore == 3 || playerTwoScore == 3) {
    declareWinner(currentPlayer);
  }

  if (playerOneClickCounter == 4 && playerTwoClickCounter == 4) {
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
      `Chance are over! ${
        isDraw ? "Game is a draw !!!" : `Winner is ${winner}`
      }`
    );
    resetGame();
  }

  // Update the score in the UI
  const playerScoreElement = document.getElementById(
    `player${CurrentPlayer}Score`
  );
  playerScoreElement.textContent = `${Players[CurrentPlayer]} Score: ${scores[CurrentPlayer]}`;

  // Switch to the next player
  CurrentPlayer = CurrentPlayer === 1 ? 2 : 1;
  gridElements.style.backgroundColor = playerColors[CurrentPlayer]; // Change the grid border color
  // game_state();

  createGridCellsInDOM();
  // Randomly place ships for each player

  placeShips(1);
  placeShips(2);

  // Function to randomly place ships for a player
  function placeShips(Player) {
    const playerGrid = playerGrids[Player];

    for (let ship = 0; ship < ship_length; ship++) {
      const shipPosition = getRandomPosition();

      // Check if ship position is already occupied
      if (playerGrid[shipPosition].classList.contains("ship")) {
        ship--; // Retry placing the ship
        continue;
      }

      // Place the ship
      for (let i = 0; i < ship_length; i++) {
        const cell = playerGrid[shipPosition + i];
        cell.classList.add("ship");
      }
    }
  }

  // Function to get a random position on the grid
  function getRandomPosition() {
    return Math.floor(
      Math.random() * (grid_size * grid_size - ship_length + 1)
    ); //index to place ship
  }

  // place the player scores in the dom

  let playerOneScoreCard = document.getElementById("player1Score");
  let playerTwoScoreCard = document.getElementById("player2Score");

  updateScoreInDOM(1);
  updateScoreInDOM(2);

  //show message
  function showMessage(message, color) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.style.display = "block";

    //show winner
    function showWinner() {
      // Determine the player with the highest score
      const maxScore = Math.max(scores[1], scores[2]);
      const winner = Object.keys(scores).find(
        (key) => scores[key] === maxScore
      );

      // Display the winner
      const winnerElement = document.getElementById("winner");
      if (winner) {
        winnerElement.textContent = `Player ${winner} wins!`;
      } else {
        winnerElement.textContent = "It's a tie!";
      }
      function resetGame() {
        // resetting all the dynamic variables
        playerGrids = { 1: [], 2: [] };

        Players = {
          1: "Player 1",
          2: "Player 2",
        };

        playerOneScore = 0;
        playerTwoScore = 0;
        playerOneClickCounter = 0;
        playerTwoClickCounter = 0;

        CurrentPlayer = 1;

        createGridCellsInDOM();

        placeShips(1);
        placeShips(2);

        updateScoreInDOM(1);
        updateScoreInDOM(2);
      }

      // resetGame();
    }
  }
}
