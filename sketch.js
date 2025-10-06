function setup() {
    createCanvas(windowWidth, windowHeight);
    setupLockedCells(grid);

    gridX = windowWidth / 2 - (cellSize * 9) / 2;
    gridY = windowHeight / 2 - (cellSize * 13) / 2;

    buttonX = gridX + cellSize + 90;
    buttonY = gridY + 480;

    revealX = buttonX + 250;
    revealY = buttonY + 60;
}

let revealX, revealY;
let revealWidth = 200;
let revealHeight = 50;

function drawSudokuGrid(x, y, cellSize) {
    let row = 0;
    while (row < 9) {
        let col = 0;
        while (col < 9) {
            let cellX = x + col * cellSize;
            let cellY = y + row * cellSize;

            stroke(0);
            strokeWeight(1);
            fill(255);
            rect(cellX, cellY, cellSize, cellSize);

            col++;
        }
        row++;
    }

    let i = 0;
    while (i <= 9) {
        let weight = (i % 3 === 0) ? 3 : 1;
        strokeWeight(weight);
        line(x + i * cellSize, y, x + i * cellSize, y + 9 * cellSize);
        line(x, y + i * cellSize, x + 9 * cellSize, y + i * cellSize);
        i++;
    }
}

function drawNumbersButton(x, y, buttonWidth, buttonHeight, spacing) {
    let i = 0;
    textSize(20);
    strokeWeight(2);
    while (i < 9) {
        let col = i % 3;
        let row = 2 - Math.floor(i / 3);
        let btnX = x + col * (buttonWidth + spacing);
        let btnY = y + row * (buttonHeight + spacing);

        fill(255);
        rect(btnX, btnY, buttonWidth, buttonHeight);

        fill(0);
        textAlign(CENTER, CENTER);
        text(i + 1, btnX + buttonWidth / 2, btnY + buttonHeight / 2);

        i++;
    }
}

const UNASSIGNED = 0;
const N = 9;

function findUnassignedLocation(grid, pos) {
    let row = 0;
    while (row < N) {
        let col = 0;
        while (col < N) {
            if (grid[row][col] === UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
            col++;
        }
        row++;
    }
    return false;
}

function usedInRow(grid, row, num) {
    let col = 0;
    while (col < N) {
        if (grid[row][col] === num) return true;
        col++;
    }
    return false;
}

function usedInCol(grid, col, num) {
    let row = 0;
    while (row < N) {
        if (grid[row][col] === num) return true;
        row++;
    }
    return false;
}

function usedInBox(grid, boxStartRow, boxStartCol, num) {
    let row = 0;
    while (row < 3) {
        let col = 0;
        while (col < 3) {
            if (grid[row + boxStartRow][col + boxStartCol] === num) return true;
            col++;
        }
        row++;
    }
    return false;
}

function isSafe(grid, row, col, num) {
    return (
        !usedInRow(grid, row, num) &&
        !usedInCol(grid, col, num) &&
        !usedInBox(grid, row - (row % 3), col - (col % 3), num) &&
        grid[row][col] === UNASSIGNED
    );
}

function solveSudoku(grid) {
    let pos = { row: 0, col: 0 };
    if (!findUnassignedLocation(grid, pos)) return true;
    let row = pos.row;
    let col = pos.col;
    let num = 1;
    while (num <= 9) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = UNASSIGNED;
        }
        num++;
    }
    return false;
}

let grid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function drawNumbersInGrid(grid, x, y, cellSize) {
    textAlign(CENTER, CENTER);
    textSize(30);
    strokeWeight(0);
    
    let row = 0;
    while (row < 9) {
        let col = 0;
        while (col < 9) {
            if (grid[row][col] !== 0) {
                let cellX = x + col * cellSize;
                let cellY = y + row * cellSize;
                
                if (lockedCells[row][col]) {
                    fill(200, 200, 200, 150);
                    noStroke();
                    rect(gridX + col * cellSize, gridY + row * cellSize, cellSize, cellSize)
                    fill(0);
                    stroke(0);
                } else {
                    fill(0, 0, 255);
                }
                
                text(grid[row][col], cellX + cellSize / 2, cellY + cellSize / 2);
            }
            col++;
        }
        row++;
    }
}

let gridX, gridY, cellSize = 50;
let buttonX, buttonY;

let lockedCells = [];

function setupLockedCells(grid) {
    let row = 0;
    while (row < 9) {
        lockedCells[row] = [];
        let col = 0;
        while (col < 9) {
            lockedCells[row][col] = grid[row][col] !== 0;
            col++;
        }
        row++;
    }
}

let solvedGrid = JSON.parse(JSON.stringify(grid));
solveSudoku(solvedGrid);

function checkAnswer(playerGrid, solutionGrid) {
    let row = 0;
    while (row < 9) {
        let col = 0;
        while (col < 9) {
            if (playerGrid[row][col] !== solutionGrid[row][col]) {
                return false;
            }
            col++;
        }
        row++;
    }
    return true;
}

let deleteMode = false;

function drawDeleteButton(x, y, buttonWidth, buttonHeight) {
    fill(255, 100, 100);
    rect(x, y, buttonWidth, buttonHeight);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("DEL", x + buttonWidth / 2, y + buttonHeight / 2);
}

function drawRevealButton(x, y, w, h) {
    fill(100, 200, 255);
    rect(x, y, w, h);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("REVEAL ANSWER", x + w/2, y + h/2);
}
    
let selectedNumber = null;

function mousePressed() {
    let i = 0;
    while (i < 9) {
        let col = i % 3;
        let row = 2 - Math.floor(i / 3);
        let btnX = buttonX + col * (50 + 10);
        let btnY = buttonY + row * (50 + 10);

        if (mouseX > btnX && mouseX < btnX + 50 &&
            mouseY > btnY && mouseY < btnY + 50) {
                selectedNumber = i + 1;
                deleteMode = false;
                return;
            }
            i++;
    }

    let delX = buttonX - 80;
    let delY = buttonY + 120;
    if (mouseX > delX && mouseX < delX + 50 &&
        mouseY > delY && mouseY < delY + 50) {
            deleteMode = true;
            selectedNumber = null;
            return;
        }

    if (mouseX > revealX && mouseX < revealX + revealWidth &&
        mouseY > revealY && mouseY < revealY + revealHeight) {
            grid = JSON.parse(JSON.stringify(solvedGrid));
            selectedNumber = null;
            deleteMode = false;
            return;
        }

        if (mouseX > gridX && mouseX < gridX + 9 * cellSize &&
            mouseY > gridY && mouseY < gridY + 9 * cellSize) {

                let col = Math.floor((mouseX - gridX) / cellSize);
                let row = Math.floor((mouseY - gridY) / cellSize);

                if (!lockedCells[row][col]) {
                    if (deleteMode) {
                        grid[row][col] = UNASSIGNED;
                        deleteMode = false;
                    } else if (selectedNumber !== null) {
                        grid[row][col] = selectedNumber;
                        selectedNumber = null;
                    }
                }
            }
}

function draw() {
    background(220);

    drawSudokuGrid(gridX, gridY, 50);
    drawNumbersInGrid(grid, gridX, gridY, 50);

    drawNumbersButton(buttonX, buttonY, 50, 50, 10);
    drawRevealButton(revealX, revealY, revealWidth, revealHeight);
    drawDeleteButton(buttonX - 80, buttonY + 120, 50, 50);
    
    if (checkAnswer(grid, solvedGrid)) {
        textAlign(CENTER, CENTER);
        textSize(50);
        fill(0, 150, 0);
        text("YOU WIN!", windowWidth / 2, gridY - 60);
    }
}