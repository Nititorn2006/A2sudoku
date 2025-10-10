let init_number = [];
let userNumber;

function preload() {
    loadStrings("puzzle.txt", (lines) => {
        init_number = lines.map(line => line.split(" ").map(Number));
        console.log(init_number);
    });
}

function setup() {
    userNumber = JSON.parse(JSON.stringify(init_number));
    solveSudoku(userNumber);

    createCanvas(windowWidth, windowHeight);
    setupLockedCells(init_number);

    gridX = windowWidth / 2 - (cellSize * 9) / 2;
    gridY = windowHeight / 2 - (cellSize * 13) / 2;

    buttonX = gridX + cellSize + 90;
    buttonY = gridY + 480;
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

function drawNumpad(x, y, buttonWidth, buttonHeight, spacing) {
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

function findUnassignedLocation(init_number, pos) {
    let row = 0;
    while (row < N) {
        let col = 0;
        while (col < N) {
            if (init_number[row][col] === UNASSIGNED) {
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

function usedInRow(init_number, row, num) {
    let col = 0;
    while (col < N) {
        if (init_number[row][col] === num) return true;
        col++;
    }
    return false;
}

function usedInCol(init_number, col, num) {
    let row = 0;
    while (row < N) {
        if (init_number[row][col] === num) return true;
        row++;
    }
    return false;
}

function usedInBox(init_number, boxStartRow, boxStartCol, num) {
    let row = 0;
    while (row < 3) {
        let col = 0;
        while (col < 3) {
            if (init_number[row + boxStartRow][col + boxStartCol] === num) return true;
            col++;
        }
        row++;
    }
    return false;
}

function isSafe(init_number, row, col, num) {
    return (
        !usedInRow(init_number, row, num) &&
        !usedInCol(init_number, col, num) &&
        !usedInBox(init_number, row - (row % 3), col - (col % 3), num) &&
        init_number[row][col] === UNASSIGNED
    );
}

function solveSudoku(init_number) {
    let pos = { row: 0, col: 0 };
    if (!findUnassignedLocation(init_number, pos)) return true;
    let row = pos.row;
    let col = pos.col;
    let num = 1;
    while (num <= 9) {
        if (isSafe(init_number, row, col, num)) {
            init_number[row][col] = num;
        if (solveSudoku(init_number)) return true;
            init_number[row][col] = UNASSIGNED;
        }
        num++;
    }
    return false;
}

function drawNumber(init_number, x, y, cellSize) {
    textAlign(CENTER, CENTER);
    textSize(30);
    strokeWeight(0);
    
    let row = 0;
    while (row < 9) {
        let col = 0;
        while (col < 9) {
            if (init_number[row][col] !== 0 && init_number[row][col] !== userNumber[row][col]) {
                let c = 0;
                while (c < 9) {
                    fill(255, 200, 200, 150);
                    noStroke();
                    rect(x + c * cellSize, y + row * cellSize, cellSize, cellSize);
                    c++;
                }

                let r = 0;
                while(r < 9) {
                    fill(255, 200, 200, 150);
                    noStroke();
                    rect(x + col * cellSize, y + r * cellSize, cellSize, cellSize);
                    r++;
                }
            }
            if (init_number[row][col] !== 0) {
                let cellX = x + col * cellSize;
                let cellY = y + row * cellSize;
                
                if (fixed[row][col]) {
                    fill(200, 200, 200, 150);
                    noStroke();
                    rect(gridX + col * cellSize, gridY + row * cellSize, cellSize, cellSize)
                    fill(0);
                    stroke(0);
                } else if (init_number[row][col] === userNumber[row][col]) {
                    fill(0, 0, 255);
                } else {
                    fill(255, 0, 0);
                }
                
                text(init_number[row][col], cellX + cellSize / 2, cellY + cellSize / 2);
            }
            col++;
        }
        row++;
    }
}

let gridX, gridY, cellSize = 50;
let buttonX, buttonY;

let fixed = [];

function setupLockedCells(init_number) {
    let row = 0;
    while (row < 9) {
        fixed[row] = [];
        let col = 0;
        while (col < 9) {
            fixed[row][col] = init_number[row][col] !== 0;
            col++;
        }
        row++;
    }
}


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

function deleteButton(x, y, buttonWidth, buttonHeight) {
    fill(255, 100, 100);
    stroke(0);
    rect(x, y, buttonWidth, buttonHeight);
    
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("X", x + buttonWidth / 2, y + buttonHeight / 2);
}
    
let selectedNumber = null;

let lastPlacedCell = null;
let feedbackMessage = "Select a number to place :)";

function mousePressed() {
    let buttonWidth = 50;
    let buttonHeight = 50;
    let spacing = 10;

    let i = 0;
    while (i < 9) {
        let col = i % 3;
        let row = 2 - Math.floor(i / 3);
        let btnX = buttonX - 140 + col * (buttonWidth + spacing);
        let btnY = buttonY + row * (buttonHeight + spacing);

        if (mouseX > btnX && mouseX < btnX + buttonWidth &&
            mouseY > btnY && mouseY < btnY + buttonHeight) {
                selectedNumber = i + 1;
                deleteMode = false;
                return;
            }
            i++;
    }

    let delX = buttonX - 140;
    let delY = buttonY + 190;
    if (mouseX > delX && mouseX < delX + 50 &&
        mouseY > delY && mouseY < delY + 50) {
            deleteMode = true;
            selectedNumber = null;
            return;
        }

        if (mouseX > gridX && mouseX < gridX + 9 * cellSize &&
            mouseY > gridY && mouseY < gridY + 9 * cellSize) {

                let col = Math.floor((mouseX - gridX) / cellSize);
                let row = Math.floor((mouseY - gridY) / cellSize);

                if (!fixed[row][col]) {
                    if (deleteMode) {
                        init_number[row][col] = UNASSIGNED;
                        lastPlacedCell = null;
                    } else if (selectedNumber !== null) {
                        init_number[row][col] = selectedNumber;
                        lastPlacedCell = {row,col};
                        if (init_number[row][col] === userNumber[row][col]) {
                            feedbackMessage = "good :)"
                        } else {
                            feedbackMessage = "not good :("
                        }
                    }
                }
            }
}

function draw() {
    background(220);
    
    drawSudokuGrid(gridX, gridY, 50);
    drawNumber(init_number, gridX, gridY, 50);
    
    drawNumpad(buttonX - 140, buttonY, 50, 50, 10);
    deleteButton(buttonX - 140, buttonY + 190, 50, 50);
    
    if (checkAnswer(init_number, userNumber)) {
        textAlign(CENTER, CENTER);
        textSize(50);
        fill(0, 150, 0);
        text("YOU WIN!", windowWidth / 2, gridY - 60);
    } else {
        textSize(20);
        strokeWeight(0);
        fill(0);
        textAlign(LEFT, CENTER);
        

        let displayText = "Selected: ";
        if (deleteMode) {
            displayText += "Delete Mode";
        } else if (selectedNumber !== null) {
            displayText += selectedNumber;
        } else {
            displayText += "-";
        }
        text(displayText, gridX, gridY + 470);

        let hintText = feedbackMessage;
        text(hintText, gridX - 10, gridY - 40);
    }

}