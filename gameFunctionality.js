// Global bingoCard variable that will be set from generateBingoCard.js
let bingoCard = [];

export function setBingoCard(card) {
    bingoCard = card;
}

export function wasClicked(cell, buttonElement, event) {
    // Toggle the clicked state of the BingoCell
    cell.toggle();
    
    // Get the position of the clicked button for the red circle
    const buttonRect = buttonElement.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Set the position of the red circle to the button's center
    const redCircle = document.getElementById("redCircle");
    
    // Make the circle exactly centered on the button
    redCircle.style.left = `${buttonCenterX}px`;
    redCircle.style.top = `${buttonCenterY}px`;
    
    // Make the circle visible
    redCircle.style.display = 'block';
    
    // Mark the button as clicked in appearance
    if (cell.isClicked) {
        if (!buttonElement.classList.contains("button-star")) {
            buttonElement.style.backgroundColor = "rgb(48, 61, 143)";
            buttonElement.style.color = "rgb(255, 255, 255)";
        }
    } else {
        if (!buttonElement.classList.contains("button-star")) {
            buttonElement.style.backgroundColor = "rgb(255, 255, 255)";
            buttonElement.style.color = "rgb(48, 61, 143)";
        }
        
        // Hide the circle if unchecking
        redCircle.style.display = 'none';
    }

    // Check if this click results in a win
    if (hasWon(cell)) {
        alert("Bingo! You've won!");
    }
}

export function hasWon(recentlyClickedCell) {
    // Extract coordinates from the cellName format buttonXY
    let cellName = recentlyClickedCell.cellName;
    let row = Math.floor(parseInt(cellName.replace("button", "")) / 10) - 1;
    let col = (parseInt(cellName.replace("button", "")) % 10) - 1;
    
    // Only check for win if the cell is clicked
    if (!recentlyClickedCell.isClicked) {
        return false;
    }

    // Check for a horizontal win
    let horizontalWin = true;
    for (let c = 0; c < 5; c++) {
        if (!bingoCard[row][c].isClicked) {
            horizontalWin = false;
            break;
        }
    }

    // Check for a vertical win
    let verticalWin = true;
    for (let r = 0; r < 5; r++) {
        if (!bingoCard[r][col].isClicked) {
            verticalWin = false;
            break;
        }
    }

    // Check for diagonal win (top-left to bottom-right)
    let diagonalWin1 = true;
    if (row === col) {
        for (let i = 0; i < 5; i++) {
            if (!bingoCard[i][i].isClicked) {
                diagonalWin1 = false;
                break;
            }
        }
    } else {
        diagonalWin1 = false;
    }

    // Check for diagonal win (top-right to bottom-left)
    let diagonalWin2 = true;
    if (row + col === 4) {
        for (let i = 0; i < 5; i++) {
            if (!bingoCard[i][4 - i].isClicked) {
                diagonalWin2 = false;
                break;
            }
        }
    } else {
        diagonalWin2 = false;
    }

    // Return true if any win condition is met
    return horizontalWin || verticalWin || diagonalWin1 || diagonalWin2;
}