/*----- variables -----*/
let hasChosenFactory;
let round;
let score;
let infoMsg;
let bag;
const tileColours = ["blue", "yellow", "red", "black", "white"];
const forIteration = ["one", "two", "three", "four", "five"];
const floorScoreLookup = {
  0: 0,
  1: 1,
  2: 2,
  3: 4,
  4: 6,
  5: 8,
  6: 11,
  7: 14,
};

/*----- element references -----*/
const factories = document.querySelector("#factories");
const factoriesArray = document.querySelectorAll(".factory");
const hand = document.querySelector("#hand");
const table = document.querySelector("#table");
const lineContainer = document.querySelector("#line-container");
const lines = document.querySelectorAll(".line");
const floor = document.querySelectorAll(".floor-tile");

/*----- functions -----*/
function initialise() {
  document.querySelector("#game-start-bg").style.display = "none";
  document.querySelector(".play-again").style.display = "none";
  hasChosenFactory = false;
  round = 1;
  score = 0;
  infoMsg = " ";
  bag = [
    { blue: 20 },
    { yellow: 20 },
    { red: 20 },
    { black: 20 },
    { white: 20 },
  ];
  setupFactories();
  renderInfo();
}

function setupFactory(factory) {
  let selectedTile;
  let tileQuantity;
  for (let i = 0; i < 4; i++) {
    // Selecting a non-empty colour
    tileQuantity = 0;
    while (tileQuantity === 0) {
      selectedTile = bag[Math.floor(Math.random() * bag.length)];
      if (Object.values(selectedTile)[0] > 0) {
        tileQuantity = Object.values(selectedTile)[0];
      }
    }
    let selectedTileColour = Object.keys(selectedTile)[0];

    let tile;
    switch (selectedTileColour) {
      case "blue":
        bag[0].blue -= 1;
        tile = document.createElement("div");
        tile.classList.add("piece", "blue");
        factory.appendChild(tile);
        break;
      case "yellow":
        bag[1].yellow -= 1;
        tile = document.createElement("div");
        tile.classList.add("piece", "yellow");
        factory.appendChild(tile);
        break;
      case "red":
        bag[2].red -= 1;
        tile = document.createElement("div");
        tile.classList.add("piece", "red");
        factory.appendChild(tile);
        break;
      case "black":
        bag[3].black -= 1;
        tile = document.createElement("div");
        tile.classList.add("piece", "black");
        factory.appendChild(tile);
        break;
      case "white":
        bag[4].white -= 1;
        tile = document.createElement("div");
        tile.classList.add("piece", "white");
        factory.appendChild(tile);
        break;
    }
  }
}

function setupFactories() {
  factoriesArray.forEach((factory) => setupFactory(factory));
}

function moveToFloor() {
  for (const square of floor) {
    // if hand is empty, break from the loop
    if (!hand.firstElementChild) {
      break;
    }
    // if floor tile contains a piece, move on to the next
    if (square.firstElementChild) {
      continue;
    }
    hand.firstElementChild.setAttribute("draggable", false);
    square.append(hand.firstElementChild);
  }
  hasChosenFactory = false;
}

function wallTiling() {
  console.log("wall tiling phase active");
  for (const line of lines) {
    const containers = line.children;
    // Prevents error occurring if users press button twice
    if (!containers[0].firstElementChild) {
      continue;
    }
    // if line is not complete, move on to the next line
    if (![...containers].every((item) => item.firstElementChild)) {
      continue;
    }
    // if line is complete, append the first position piece to corresponding wall tile
    const currentLineRow = line.classList[1];
    const currentWallRow = document.querySelectorAll(
      `.wall-tile.${currentLineRow}`
    );
    const firstTile = line.firstElementChild.firstElementChild;
    const firstTileColour = firstTile.classList[1];
    const currentWallTile = [...currentWallRow].find((square) =>
      square.classList.contains(firstTileColour)
    );
    firstTile.setAttribute("draggable", false);
    currentWallTile.append(firstTile);
    wallTileScoring(currentWallTile);
  }
  floorScoring();
  console.log("Total score: " + score);
}

function wallTileScoring(currentTilePos) {
  let currentScore = 0;
  currentScore += 1;
  let currentTileCol = currentTilePos.classList[2];
  let nextSibling = currentTilePos.nextElementSibling;
  let previousSibling = currentTilePos.previousElementSibling;
  // Search for adjacent tiles in the column for pieces for scoring
  while (nextSibling) {
    if (nextSibling.classList[2] === currentTileCol) {
      if (!nextSibling.firstElementChild) {
        break;
      } else {
        currentScore += 1;
      }
    }
    nextSibling = nextSibling.nextElementSibling;
  }
  while (previousSibling) {
    if (previousSibling.classList[2] === currentTileCol) {
      if (!previousSibling.firstElementChild) {
        break;
      } else {
        currentScore += 1;
      }
    }
    previousSibling = previousSibling.previousElementSibling;
  }
  nextSibling = currentTilePos.nextElementSibling;
  previousSibling = currentTilePos.previousElementSibling;
  // Search for adjacent tiles in the row for pieces for scoring
  let currentTileRow = currentTilePos.classList[3];
  while (nextSibling) {
    if (nextSibling.classList[3] === currentTileRow) {
      if (!nextSibling.firstElementChild) {
        break;
      } else {
        currentScore += 1;
      }
    }
    nextSibling = nextSibling.nextElementSibling;
  }
  while (previousSibling) {
    if (previousSibling.classList[3] === currentTileRow) {
      if (!previousSibling.firstElementChild) {
        break;
      } else {
        currentScore += 1;
      }
    }
    previousSibling = previousSibling.previousElementSibling;
  }
  score += currentScore;
  console.log("Current score: " + currentScore);
}

function floorScoring() {
  let count = 0;
  // counts number of pieces in the floor area
  for (const square of floor) {
    if (square.firstElementChild) {
      count += 1;
    }
  }
  score -= floorScoreLookup[count.toString()];
}

function removePieces() {
  for (const line of lines) {
    if (line.firstElementChild.firstElementChild) {
      continue;
    }
    const squares = line.children;
    for (const square of squares) {
      if (square.firstElementChild) {
        square.firstElementChild.remove();
      }
    }
  }
  for (const square of floor) {
    if (square.firstElementChild) {
      square.firstElementChild.remove();
    }
  }
}

function finalScoring() {
  // Checks for 5 of a kind in the wall
  for (const colour of tileColours) {
    const currentSquares = document.querySelectorAll(`.wall-tile.${colour}`);
    [...currentSquares].every((square) => square.firstElementChild)
      ? (score += 10)
      : (score += 0);
  }
  // Checks for complete columns and rows
  for (const num of forIteration) {
    const allColumns = document.querySelectorAll(`.wall-tile.column-${num}`);
    const allRows = document.querySelectorAll(`.wall-tile.row-${num}`);
    [...allColumns].every((square) => square.firstElementChild)
      ? (score += 7)
      : (score += 0);
    [...allRows].every((square) => square.firstElementChild)
      ? (score += 2)
      : (score += 0);
  }
}

function dummyTurn() {
  console.log("Dummy makes a move");
  const factoriesState = [];
  let largestSetIndex;
  let largestSetColour;
  // if factories and table are empty, do nothing
  if (
    ![...factoriesArray].find((factory) => factory.children.length > 0) &&
    table.children.length === 0
  ) {
    return;
  }
  // if all factories are empty, take a random tile from table
  if (![...factoriesArray].find((factory) => factory.children.length > 0)) {
    console.log("factories are empty!");
    const randomPieceIndex = Math.floor(Math.random() * table.children.length);
    const randomPieceColour = table.children[randomPieceIndex].classList[1];
    [...table.children].forEach((tile) => {
      if (tile.classList[1] === randomPieceColour) {
        tile.remove();
      }
    });
    infoMsg = `Dummy removed a random set of ${randomPieceColour} pieces from the table`;
    renderInfo();
    return;
  }
  // Create an object to document number of each coloured piece in each factory
  for (const factory of [...factoriesArray]) {
    if (factory.children.length === 0) {
      factoriesState.push({});
      continue;
    }
    const factoryState = [...factory.children].reduce((a, piece) => {
      a[piece.classList[1]]
        ? (a[piece.classList[1]] += 1)
        : (a[piece.classList[1]] = 1);
      return a;
    }, {});
    factoriesState.push(factoryState);
  }
  // Checks if any factory has a set of 4
  if (factoriesState.find((factory) => Object.values(factory).includes(4))) {
    largestSetIndex = factoriesState.findIndex((factory) =>
      Object.values(factory).includes(4)
    );
    largestSetColour =
      factoriesArray[largestSetIndex].firstElementChild.classList[1];
    [...factoriesArray[largestSetIndex].children].forEach((tile) => {
      tile.remove();
    });
    infoMsg = `Dummy removed a set of 4 ${largestSetColour} pieces from the factory`;
    renderInfo();
    return;
  }
  // Checks if any factory has a set of 3
  if (factoriesState.find((factory) => Object.values(factory).includes(3))) {
    largestSetIndex = factoriesState.findIndex((factory) =>
      Object.values(factory).includes(3)
    );
    largestSetColour = Object.keys(factoriesState[largestSetIndex]).find(
      (key) => factoriesState[largestSetIndex][key] === 3
    );
    [...factoriesArray[largestSetIndex].children].forEach((tile) => {
      if (tile.classList.contains(largestSetColour)) {
        tile.remove();
      } else {
        table.append(tile);
      }
    });
    infoMsg = `Dummy removed a set of 3 ${largestSetColour} pieces from the factory`;
    renderInfo();
    return;
  }
  // Checks if any factory has a set of 2
  if (factoriesState.find((factory) => Object.values(factory).includes(2))) {
    largestSetIndex = factoriesState.findIndex((factory) =>
      Object.values(factory).includes(2)
    );
    largestSetColour = Object.keys(factoriesState[largestSetIndex]).filter(
      (key) => factoriesState[largestSetIndex][key] === 2
    );
    const randomColour =
      largestSetColour[Math.floor(Math.random() * largestSetColour.length)];
    [...factoriesArray[largestSetIndex].children].forEach((tile) => {
      if (tile.classList.contains(randomColour)) {
        tile.remove();
      } else {
        table.append(tile);
      }
    });
    infoMsg = `Dummy removed a set of 2 ${randomColour} pieces from the factory`;
    renderInfo();
    return;
  }
  // Create an object to document number of each coloured piece in the table
  const tableState = [...table.children].reduce((a, piece) => {
    a[piece.classList[1]]
      ? (a[piece.classList[1]] += 1)
      : (a[piece.classList[1]] = 1);
    return a;
  }, {});
  // Find the colour and quantity of the largest set in the table
  const largestSetQty = Math.max(...Object.values(tableState));
  // if there are only sets of ones in the table OR if there are no pieces in the table
  if (largestSetQty <= 1) {
    const leftmostFactory = [...factoriesArray].find(
      (factory) => factory.children.length > 0
    );
    const randomTile = leftmostFactory.children[Math.floor(Math.random() * 4)];
    randomTile.remove();
    [...leftmostFactory.children].forEach((tile) => {
      table.append(tile);
      infoMsg = `Dummy removed a ${randomTile.classList[1]} piece from the leftmost available factory`;
      renderInfo();
    });
    // if there are sets of >1 in the table
  } else {
    const largestTableSetsColours = Object.keys(tableState).filter(
      (key) => tableState[key] === largestSetQty
    );
    const randomColour =
      largestTableSetsColours[
        Math.floor(Math.random() * largestTableSetsColours.length)
      ];
    [...table.children].forEach((tile) => {
      if (tile.classList.contains(randomColour)) {
        tile.remove();
        infoMsg = `Dummy removed ${randomColour} pieces from the table`;
        renderInfo();
      }
    });
  }
}

function renderInfo() {
  document.querySelector(".round-tracker").innerHTML = `Round: ${round}`;
  document.querySelector(".scoreboard").innerHTML = `Total score: ${score}`;
  // document.querySelector(".bag").innerHTML = `Message: ${bag}`;
  document.querySelector(".messages").innerHTML = `${infoMsg}`;
  setTimeout(() => {
    infoMsg = " ";
    document.querySelector(".messages").innerHTML = " ";
  }, 2000);
  if (round === 5) {
    document.querySelector(".round-tracker").innerText += " (last round!)";
  }
}

/*----- game logic -----*/

factories.addEventListener("click", (e) => {
  if (hasChosenFactory === true) {
    infoMsg = "Unable to select until pieces in hand have been placed";
    renderInfo();
    return;
  }
  if (!e.target.classList.contains("piece")) {
    return;
  }
  const factoryTiles = [...e.target.parentNode.childNodes];
  const selectedColour = e.target.classList[1];
  factoryTiles.forEach((tile) => {
    if (tile.classList.contains(selectedColour)) {
      hand.append(tile);
      tile.setAttribute("draggable", true);
    } else {
      table.append(tile);
    }
  });
  hasChosenFactory = true;
});

table.addEventListener("click", (e) => {
  if (hasChosenFactory === true) {
    infoMsg = "Unable to select until pieces in hand have been placed";
    renderInfo();
    return;
  }
  if (!e.target.classList.contains("piece")) {
    return;
  }
  const tableTiles = [...e.target.parentNode.childNodes];
  const selectedColour = e.target.classList[1];
  tableTiles.forEach((tile) => {
    if (tile.classList.contains(selectedColour)) {
      hand.append(tile);
      tile.setAttribute("draggable", true);
    }
  });
  hasChosenFactory = true;
});

let draggedPiece;
hand.addEventListener("dragstart", (e) => {
  draggedPiece = e.target;
});
lineContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});
lineContainer.addEventListener("drop", (e) => {
  // e.stopPropagation();
  const targetRow = e.target.parentNode;
  const targetRowName = targetRow.classList[1];
  const targetWallRow = document.querySelectorAll(
    `.wall-tile.${targetRowName}`
  );
  const firstPosition = e.target.parentNode.children[0];
  const draggedPieceColour = draggedPiece.classList[1];

  // If space is occupied,  piece cannot be dropped; piece cannot be dropped outside of grids
  if (
    e.target.classList.contains("piece") ||
    e.target.classList.contains("line")
  ) {
    infoMsg = "Not a valid space";
    renderInfo();
    return;
  }
  // Cannot drop piece in a row with existing pieces of different colours
  if (
    firstPosition.firstElementChild &&
    firstPosition.firstElementChild.classList[1] !== draggedPieceColour
  ) {
    infoMsg = "Cannot drop into line containing pieces of a different colour";
    renderInfo();
    return;
  }
  // Cannot drop piece if wall contains the same colour
  const targetWallTile = [...targetWallRow].find((square) =>
    square.classList.contains(draggedPieceColour)
  );
  if (targetWallTile.firstElementChild) {
    infoMsg = "Wall already contains tile of the same colour.";
    renderInfo();
    return;
  }
  // Append all the tiles in hand to the selected row
  for (const square of [...targetRow.children]) {
    // Once the hand is empty, break from the loop
    if (!hand.firstElementChild) {
      break;
    }
    // if square contains a piece, move on to the next empty square
    if (
      square.firstElementChild &&
      square.firstElementChild.classList.contains("piece")
    ) {
      continue;
    } else {
      hand.firstElementChild.setAttribute("draggable", false);
      square.append(hand.firstElementChild);
    }
  }
  // If there are leftover pieces in hand, append them to floor
  if (hand.children.length > 0) {
    moveToFloor();
  }
  // Dummy makes a move after 1sec.
  setTimeout(() => {
    dummyTurn();
  }, 750);

  hasChosenFactory = false;
});

document.querySelector(".game-start").addEventListener("click", initialise);

document.querySelector(".pass").addEventListener("click", () => {
  // users cannot pass without having selected pieces from factory/ table;
  if (!hasChosenFactory) {
    return;
  }
  // append all tiles in hand to the floor
  if (hand.children.length > 0) {
    moveToFloor();
  }
  // dummy takes a turn after passing
  setTimeout(() => {
    dummyTurn();
  }, 750);
});

document.querySelector(".next").addEventListener("click", () => {
  // Disallow users to advance if there are pieces still in factories/ hand/ table
  if (
    hand.children.length > 0 ||
    table.children.length > 0 ||
    [...factoriesArray].find((factory) => factory.children.length > 0)
  ) {
    return;
  }
  if (round === 5) {
    wallTiling();
    finalScoring();
    document.querySelector(".play-again").style.display = "block";
    renderInfo();
    document.querySelector(".round-tracker").innerText = "Game Over!";
    return;
  }
  wallTiling();
  removePieces();
  setupFactories();
  round += 1;
  console.log(bag);
  renderInfo();
});

document.querySelector(".play-again").addEventListener("click", () => {
  for (const line of lines) {
    [...line.children].forEach((square) => {
      if (square.firstElementChild) {
        square.firstElementChild.remove();
      }
    });
  }
  const wallTiles = document.querySelectorAll(".wall-tile");
  for (const square of wallTiles) {
    if (square.firstElementChild) {
      square.firstElementChild.remove();
    }
  }
  for (const square of floor) {
    if (square.firstElementChild) {
      square.firstElementChild.remove();
    }
  }
  initialise();
});
