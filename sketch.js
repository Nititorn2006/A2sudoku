function setup() {
  createCanvas(windowWidth, windowHeight);
}

function drawSudokuGrid(x, y, cellSize) {
  let row = 0;
  while (row < 9) {
    let col = 0;
    while (col < 9) {
      let cellX = x + col * cellSize;
      let cellY = y + row * cellSize;

      stroke(0);
      strokeWeight(1);
      rect(cellX, cellY, cellSize, cellSize);

      col++;
    }
    row++;
  }

  let i = 0;
  while (i <= 9) {
    let weight = (i % 3 ===0) ? 3 : 1;
    strokeWeight(weight);
    line(x + i * cellSize, y, x + i * cellSize, y + 9 * cellSize);
    line(x, y + i * cellSize, x + 9 * cellSize, y + i * cellSize);
    i++;
  }
}

function drawNumbersButton(x, y, buttonWidth, buttonHeight, spacing) {
  let i = 0;
  while (i < 9) {
    let btnX = x;
    let btnY = y + i * (buttonHeight + spacing);
    rect(btnX, btnY, buttonWidth, buttonHeight, 5);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(i + 1, btnX + buttonWidth / 2, btnY + buttonHeight / 2);

    i++;
  }
}

function draw() {
  background(220);

  let gridX = windowWidth / 2 - 225;
  let gridY = windowHeight / 2 - 225;

  drawSudokuGrid(gridX, gridY, 50);  

  let buttonX = gridX + 9 * 50 + 20;
  let buttonY = y;

  drawNumbersButton(buttonX + 100, buttonY - 40, 50, 50, 10);
}