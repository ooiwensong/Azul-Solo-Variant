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
  // console.log(e.target.classList[1]);
  // console.log(draggedPiece);
})

lineContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
})

let chosenRow;
lineContainer.addEventListener("drop", (e) => {
  // e.stopPropagation();

  const targetRow = e.target.parentNode.classList[1];
  const firstPosition = e.target.parentNode.children[0];
  const draggedPieceColour = draggedPiece.classList[1];

  // If space is occupied,  peice cannot be dropped
  if (e.target.classList.contains("piece") || e.target.classList.contains("line")) {
    return;
  }

  // If first position of a line is empty, piece cannot be dropped into other positions along the line.
  if (firstPosition.children.length === 0 && e.target !== firstPosition) {
    return;
  }

  if (!chosenRow /* ADD CONDITION TO CHECK IF WALL HAS SAME COLOR TILE */) {
    e.target.append(draggedPiece);
    chosenRow = targetRow;
  } else if (chosenRow === targetRow) {
    e.target.append(draggedPiece);
  } else if (draggedPieceColour === firstPosition.firstChild.classList[1]) {
    e.target.append(draggedPiece);
  }

  if (chosenRow) {

  }
  // if (draggedPieceColour !== firstPosition.firstChild.classList[1]) {
  //   return;
  // } 

  // If a row has not been picked (empty), first tile dropped should be in the first position of any row.
  // If a row has been picked, then subsequent tiles can only be placed in the same row.
  // If there is an existing uncompleted row, tiles of the same colour can be placed there as well.

  /*
  }*/
  console.log(firstPosition.firstChild.classList[1]);

  // If the hand is empty, Dummy takes an action.
  if (hand.children.length === 0) {
    // dummyTurn();
    hasChosenFactory = false;
    chosenRow = "";
  }
  // console.log(draggedPiece.classList[1])
  // console.log(firstPosition.firstChild.classList[1])
});
