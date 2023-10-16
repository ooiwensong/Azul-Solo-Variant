/*----- variables -----*/
let factoryOfferPhase;
let wallTilingPhase;
let hasChosenFactory = false;
let round;
let score = 0;
let infoMsg;
const bag = [
  { blue: 20 },
  { yellow: 20 },
  { red: 20 },
  { black: 20 },
  { white: 20 },
]
const tileColours = ["blue", "yellow", "red", "black", "white"];
const forIteration = ["one", "two", "three", "four", "five"];
const floorScoreLookup = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 4,
  '4': 6,
  '5': 8,
  '6': 11,
  '7': 14,
}

/*----- element references -----*/
const factories = document.querySelector("#factories");
const factoriesArray = document.querySelectorAll(".factory");
const hand = document.querySelector("#hand")
const table = document.querySelector("#table");
const lineContainer = document.querySelector("#line-container");
const lines = document.querySelectorAll(".line");
const floor = document.querySelectorAll(".floor-tile");

/*----- functions -----*/
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
  console.log(bag);
}

function moveToFloor() {
  for (const square of floor) {
    // if hand is empty, break from the loop
    if (!hand.firstChild) {
      break;
    }
    // if floor tile contains a piece, move on to the next
    if (square.firstChild) {
      continue;
    }
    hand.firstChild.setAttribute("draggable", false);
    square.append(hand.firstChild);
  }
}

function wallTileScoring(currentTilePos) {
  score += 1;
  let currentTileCol = currentTilePos.classList[2];
  let nextSibling = currentTilePos.nextElementSibling;
  let previousSibling = currentTilePos.previousElementSibling;
  // Search for adjacent tiles in the column for pieces for scoring
  while (nextSibling) {
    if (nextSibling.classList[2] === currentTileCol) {
      if (!nextSibling.firstElementChild) {
        break;
      } else {
        score += 1;
      }
    }
    nextSibling = nextSibling.nextElementSibling;
  }
  while (previousSibling) {
    if (previousSibling.classList[2] === currentTileCol) {
      if (!previousSibling.firstElementChild) {
        break;
      } else {
        score += 1;
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
        score += 1;
      }
    }
    nextSibling = nextSibling.nextElementSibling;
  }
  while (previousSibling) {
    if (previousSibling.classList[3] === currentTileRow) {
      if (!previousSibling.firstElementChild) {
        break;
      } else {
        score += 1;
      }
    }
    previousSibling = previousSibling.previousElementSibling;
  }
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

function finalScoring() {
  // Checks for 5 of a kind in the wall
  for (const colour of tileColours) {
    const currentSquares = document.querySelectorAll(`.wall-tile.${colour}`);
    currentSquares.every((square) => square.firstElementChild) ? score += 10 : score += 0;
  }
  // Checks for complete columns and rows
  for (const num of forIteration) {
    const allColumns = document.querySelectorAll(`.wall-tile.column-${num}`);
    const allRows = document.querySelectorAll(`.wall-tile.row-${num}`);
    allColumns.every((square) => square.firstElementChild) ? score += 7 : score += 0;
    allRows.every((square) => square.firstElementChild) ? score += 2 : score += 0;
  }
}

function dummyTurn() {
  console.log("Dummy makes a move");
  const factoriesState = [];
  let largestSetIndex;
  let largestSetColour;
  // if factories and table are empty, do nothing
  if (![...factoriesArray].find((factory) => factory.children.length > 0) && table.children.length === 0) {
    return;
  }
  // if all factories are empty, take a random tile from table
  if (![...factoriesArray].find((factory) => factory.children.length > 0)) {
    console.log("factories are empty!")
    const randomPieceIndex = Math.floor(Math.random() * table.children.length);
    const randomPieceColour = table.children[randomPieceIndex].classList[1];
    [...table.children].forEach((tile) => {
      if (tile.classList[1] === randomPieceColour) {
        tile.remove();
      }
    })
    return;
  }
  // Create an object to document number of each coloured piece in each factory
  for (const factory of [...factoriesArray]) {
    if (factory.children.length === 0) {
      factoriesState.push({});
      continue;
    }
    const factoryState = [...factory.children].reduce((a, piece) => {
      a[piece.classList[1]] ? a[piece.classList[1]] += 1 : a[piece.classList[1]] = 1;
      return a;
    }, {})
    factoriesState.push(factoryState);
  }
  console.log(factoriesState);
  // Checks if any factory has a set of 4
  if (factoriesState.find((factory) => Object.values(factory).includes(4))) {
    largestSetIndex = factoriesState.findIndex((factory) => Object.values(factory).includes(4));
    largestSetColour = Object.keys(factoriesState[largestSetIndex]).find((key) => factoriesState[largestSetIndex][key] === 4);
    [...factoriesArray[largestSetIndex].children].forEach((tile) => {
      if (tile.classList.contains(largestSetColour)) {
        tile.remove();
      } else {
        table.append(tile);
      }
    })
    console.log("Removed a set of 4");
    return;
  }
  // Checks if any factory has a set of 3 
  if (factoriesState.find((factory) => Object.values(factory).includes(3))) {
    largestSetIndex = factoriesState.findIndex((factory) => Object.values(factory).includes(3));
    largestSetColour = Object.keys(factoriesState[largestSetIndex]).find((key) => factoriesState[largestSetIndex][key] === 3);
    [...factoriesArray[largestSetIndex].children].forEach((tile) => {
      if (tile.classList.contains(largestSetColour)) {
        tile.remove();
      } else {
        table.append(tile);
      }
    })
    console.log("Removed a set of 3");
    return;
  }
  // Checks if any factory has a set of 2 
  if (factoriesState.find((factory) => Object.values(factory).includes(2))) {
    largestSetIndex = factoriesState.findIndex((factory) => Object.values(factory).includes(2));
    largestSetColour = Object.keys(factoriesState[largestSetIndex]).find((key) => factoriesState[largestSetIndex][key] === 2);
    [...factoriesArray[largestSetIndex].children].forEach((tile) => {
      if (tile.classList.contains(largestSetColour)) {
        tile.remove();
      } else {
        table.append(tile);
      }
    })
    console.log("Removed a set of 2");
    return;
  }
  // Create an object to document number of each coloured piece in the table
  const tableState = [...table.children].reduce((a, piece) => {
    a[piece.classList[1]] ? a[piece.classList[1]] += 1 : a[piece.classList[1]] = 1;
    return a;
  }, {})
  // Find the colour and quantity of the largest set in the table
  const largestSetQty = Math.max(...Object.values(tableState));
  largestSetColour = Object.keys(tableState).find((key) => tableState[key] === largestSetQty);
  if (largestSetQty === 1) {
    const leftmostFactory = [...factoriesArray].find((factory) => factory.children.length > 0);
    const leftmostColour = leftmostFactory.firstElementChild.classList[1];
    [...leftmostFactory.children].forEach((tile) => {
      if (tile.classList.contains(leftmostColour)) {
        tile.remove();
      } else {
        table.append(tile);
      }
    })
  } else {
    [...table.children].forEach((tile) => {
      if (tile.classList.contains(largestSetColour)) {
        tile.remove();
      }
    })
  }
}

/*----- game logic -----*/
setupFactories();


factories.addEventListener("click", (e) => {
  if (hasChosenFactory == true) {
    console.log("Place your hand pieces into the lines below")
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
  })
  hasChosenFactory = true;
})

table.addEventListener("click", (e) => {
  if (hasChosenFactory == true) {
    console.log("Place your hand pieces into the lines below")
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
  })
  hasChosenFactory = true;
})

let draggedPiece;
hand.addEventListener("dragstart", (e) => {
  draggedPiece = e.target;
})
lineContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
})
lineContainer.addEventListener("drop", (e) => {
  // e.stopPropagation();
  const targetRow = e.target.parentNode;
  const targetRowName = targetRow.classList[1];
  const targetWallRow = document.querySelectorAll(`.wall-tile.${targetRowName}`);
  const firstPosition = e.target.parentNode.children[0];
  const draggedPieceColour = draggedPiece.classList[1];

  // If space is occupied,  piece cannot be dropped; piece cannot be dropped outside of grids
  if (e.target.classList.contains("piece") || e.target.classList.contains("line")) {
    console.log("Not a valid space")
    return;
  }
  // Cannot drop piece in a row with existing pieces of different colours
  if (firstPosition.firstChild && firstPosition.firstChild.classList[1] !== draggedPieceColour) {
    console.log("Cannot drop into line containing pieces of a different colour")
    return;
  }
  // Cannot drop piece if wall contains the same colour
  const targetWallTile = [...targetWallRow].find((square) => square.classList.contains(draggedPieceColour));
  if (targetWallTile.firstElementChild) {
    console.log("Wall already contains tile of the same colour.")
    return;
  }

  // Append all the tiles in hand to the selected row
  for (const square of [...targetRow.children]) {
    // Once the hand is empty, break from the loop
    if (!hand.firstChild) {
      break;
    }
    // if square contains a piece, move on to the next empty square
    if (square.firstChild && square.firstChild.classList.contains("piece")) {
      continue;
    } else {
      hand.firstChild.setAttribute("draggable", false);
      square.append(hand.firstChild);
    }
  }
  // If there are leftover pieces in hand, append them to floor
  if (hand.children.length > 0) {
    moveToFloor();
  }
  dummyTurn();

  hasChosenFactory = false;
});

document.querySelector(".button").addEventListener("click", () => {
  console.log("wall tiling phase active");
  for (const line of lines) {
    const containers = line.children;
    // Prevents error occurring if users press button twice
    if (!containers[0].firstElementChild) {
      continue;
    }
    // if line is not complete, move on to the next line
    if (![...containers].every((item) => item.firstChild)) {
      continue;
    }
    // if line is complete, append the first position piece to corresponding wall tile
    const currentLineRow = line.classList[1];
    const currentWallRow = document.querySelectorAll(`.wall-tile.${currentLineRow}`);
    const firstTile = line.firstElementChild.firstElementChild;
    const firstTileColour = firstTile.classList[1];
    const currentWallTile = [...currentWallRow].find((square) => square.classList.contains(firstTileColour));
    firstTile.setAttribute("draggable", false);
    currentWallTile.append(firstTile);
    wallTileScoring(currentWallTile);
  }
  floorScoring();
  console.log("Total score: " + score);
});


document.querySelector(".remove").addEventListener("click", removePieces);
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

document.querySelector(".dummy").addEventListener("click", dummyTurn);

// // four of a kind
// const found = [...factoriesArray].find((factory) => {
//   if (factory.children.length > 0) {
//     const tileColour = factory.firstElementChild.classList[1];
//     return [...factory.children].every((piece) => piece.classList[1] === tileColour);
//   }
// })

// // three of a kind
// const found1 = [...factoriesArray].find((factory) => {
//   if (factory.children.length > 0) {
//   }
// })
