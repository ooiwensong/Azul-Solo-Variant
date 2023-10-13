/*----- variables -----*/
let factoryOfferPhase;
let wallTilingPhase;
let hasChosenFactory = false;

const bag = [
  { blue: 20 },
  { yellow: 20 },
  { red: 20 },
  { black: 20 },
  { white: 20 },
]

const pieces = {
  blue: '<div class="piece blue"></div>',
  yellow: '<div class="piece yellow"></div>',
  red: '<div class="piece red"></div>',
  black: '<div class="piece black"></div>',
  white: '<div class="piece white"></div>',
}

/*----- element references -----*/
const factories = document.querySelector("#factories");
const hand = document.querySelector("#hand")
const table = document.querySelector("#table");
const lineContainer = document.querySelector("#line-container");

/*----- functions -----*/
function setupFactory(factory) {
  let selectedTile;
  let tileQuantity;
  for (let i = 0; i < 4; i++) {
    // Selecting a non-empty colour
    tileQuantity = 0;
    while (tileQuantity === 0) {
      selectedTile = bag[Math.floor(Math.random() * bag.length)]; // object (KVP)
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
  const factoriesArray = document.querySelectorAll(".factory");
  factoriesArray.forEach((factory) => setupFactory(factory));
}


/*----- game logic -----*/
setupFactories();


factories.addEventListener("click", (e) => {
  if (hasChosenFactory == true) {
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
  const targetRowName = e.target.parentNode.classList[1];
  const firstPosition = e.target.parentNode.children[0];
  const draggedPieceColour = draggedPiece.classList[1];
  const floor = document.querySelectorAll(".floor-tile");

  // If space is occupied,  peice cannot be dropped; piece cannot be dropped outside of grids
  if (e.target.classList.contains("piece") || e.target.classList.contains("line")) {
    console.log("return point 1")
    return;
  }
  // Cannot drop piece in a row with existing pieces of different colours
  if (firstPosition.firstChild && firstPosition.firstChild.classList[1] !== draggedPieceColour) {
    console.log("return point 2")
    return;
  }
  // CHECK FOR PIECES IN THE WALL AREA

  // Append all the tiles in hand to the selected row
  for (const square of [...targetRow.children]) {
    // Once the hand is empty, break from the loop
    if (!hand.firstChild) {
      console.log("break point 1")
      break;
    }
    // if square contains a piece, move on to the next empty square
    if (square.firstChild && square.firstChild.classList.contains("piece")) {
      continue;
    } else {
      square.append(hand.firstChild);
    }
  }
  // If there are leftover pieces in hand, append them to floor
  if (hand.children.length > 0) {
    console.log("hand has leftovers");
    for (const floorTile of floor) {
      // if hand is empty, break from the loop
      if (!hand.firstChild) {
        console.log("break point 2")
        break;
      }
      // if floor tile contains a piece, move on to the next
      if (floorTile.firstChild) {
        continue;
      }
      floorTile.append(hand.firstChild);
    }
  }
  // dummyTurn();
  hasChosenFactory = false;
  console.log(hasChosenFactory);
});
