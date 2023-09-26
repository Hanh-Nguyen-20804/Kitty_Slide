let cols = 3;
let rows = 3;
let font;
let catpic = 0;
let pic = ['cat1.PNG', 'cat2.PNG', 'cat3.PNG', 'cat4.PNG'];

function preload() {
  img = loadImage(pic[catpic]);
  font = loadFont('Montserrat-Medium.ttf');
}

function setup() {
  createCanvas(700, 750);
  tileSize = 700/3;
  createTiles();

  let changekitty = createButton('Change Kitty');
  changekitty.position(540, height -42);
  changekitty.style('background-color', 'rgb(135, 86, 38)');
  changekitty.size(150, 35);
  changekitty.style('text-font', 'font');
  changekitty.style('font-size', '18px');
  changekitty.style('color', 'rgb(242,242,242)');
  changekitty.style('border-radius', '10px');
  changekitty.mousePressed(nextImage);

  shufflebutton = createButton('Shuffle');
  shufflebutton.position(330, height -42);
  shufflebutton.style('background-color', 'rgb(135, 86, 38)');
  shufflebutton.size(100, 35);
  shufflebutton.style('text-font', 'font');
  shufflebutton.style('font-size', '18px');
  shufflebutton.style('color', 'rgb(242,242,242)');  
  shufflebutton.style('border-radius', '10px');
  shufflebutton.mousePressed(shufflePuzzle);

  solvebutton = createButton('Solve');
  solvebutton.position(435, height -42);
  solvebutton.style('background-color', 'rgb(135, 86, 38)');
  solvebutton.size(100, 35);
  solvebutton.style('text-font', 'font');
  solvebutton.style('font-size', '18px');
  solvebutton.style('color', 'rgb(242,242,242)');
  solvebutton.style('border-radius', '10px');
  solvebutton.mousePressed(solvePuzzle);

}

let movecounter = 0;

function draw() {  
  background(191, 150, 99);
  displayTiles();

  noStroke();
  fill(242, 242, 242);
  textFont(font);
  textSize(20);
  text(` Moves: ${movecounter}`, 10, height -18);
}

function mousePressed() {
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].clicked(mouseX, mouseY);
  }
}




let tiles = [];
let emptytile;
let tileSize;


function createTiles() {
  tiles = [];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * tileSize;
      let y = j * tileSize;
      let piece = img.get(x, y, tileSize, tileSize);
      let id = i + j * cols;
      if (id === 0) {
        emptytile = new Tile(x, y, tileSize, null, id);
      }
      else {
        let tile = new Tile(x, y, tileSize, piece, id);
        tiles.push(tile);
      }
    }
  }

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].storeInitialValues();
  }
}

function displayTiles() {
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].display();
  }
  emptytile.display();
}

function nextImage() {
  catpic = (catpic + 1) % pic.length;
  loadImage(pic[catpic], (newImg) => {
    img = newImg;
    createTiles();
  });

  movecounter = 0;

}


class Tile {
  constructor(x, y, size, imgPiece, id) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.imgPiece = imgPiece;
    this.id = id;
    this.initialX = x;
    this.initialY = y;
    this.initialId = id;
  }

  storeInitialValues() {
    this.initialX = this.x;
    this.initialY = this.y;
    this.initialId = this.id;
  }

  display() {
    if (this.imgPiece) {
      image(this.imgPiece, this.x, this.y, this.size, this.size);
    } 
    else {
      fill(220);
      rect(this.x, this.y, this.size, this.size);
    }
    stroke(0);
    noFill();
    rect(this.x, this.y, this.size, this.size);
  }

  clicked(mouseX, mouseY) {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.size &&
      mouseY > this.y &&
      mouseY < this.y + this.size
    ) {
      this.move();
    }
  }

  move() {
    if (
      (this.x === emptytile.x && abs(this.y - emptytile.y) === tileSize) ||
      (this.y === emptytile.y && abs(this.x - emptytile.x) === tileSize)
    ) {
      [this.x, emptytile.x] = [emptytile.x, this.x];
      [this.y, emptytile.y] = [emptytile.y, this.y];
      [this.id, emptytile.id] = [emptytile.id, this.id];

      movecounter++;
    }
  }
}

let shufflebutton;

function shufflePuzzle() {
  let indexes = [];
  for (let i = 0; i < tiles.length; i++) {
    indexes.push(i);
  }

  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  for (let i = 0; i < tiles.length; i++) {
    let index = indexes[i];
    let tile = tiles[i];
    let targetTile = tiles[index];

    [tile.x, targetTile.x] = [targetTile.x, tile.x];
    [tile.y, targetTile.y] = [targetTile.y, tile.y];
    [tile.id, targetTile.id] = [targetTile.id, tile.id];
  }

  movecounter = 0;
}

let solvebutton;


function solvePuzzle() {
  movecounter = 0;

  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    tile.x = tile.initialX;
    tile.y = tile.initialY;
    tile.id = tile.initialId;
  }

  emptytile.x = emptytile.initialX;
  emptytile.y = emptytile.initialY;
  emptytile.id = emptytile.initialId;
}
