export function wasClicked(cell, cellElement) {
    // Toggle the clicked state of the BingoCell
    cell.isClicked = !cell.isClicked;

    // Mark or unmark the cell visually based on its clicked state
    cellElement.classList.toggle("marked", cell.isClicked);

    // Check if this click results in a win
    if (hasWon(cell)) {
        alert("Bingo! You've won!");
    }
}

export function hasWon(recentlyClickedCell) {
    let verticalWin = true;
    let horizontalWin = true;
    let diagonalWin1 = true;
    let diagonalWin2 = true;

    // Extract coordinates from the cellName
    let cellName = recentlyClickedCell.cellName;
    let coords = cellName.substring(6);
    let xCoord = parseInt(coords.charAt(0), 10);
    let yCoord = parseInt(coords.charAt(2), 10);

    if (recentlyClickedCell.isClicked) {
        // Check for a vertical win
        for (let row = 1; row <= 5; row++) {
            if (!bingoCard[row - 1][yCoord - 1].isClicked) {
                verticalWin = false;
                break;
            }
        }

        // Check for a horizontal win
        for (let col = 1; col <= 5; col++) {
            if (!bingoCard[xCoord - 1][col - 1].isClicked) {
                horizontalWin = false;
                break;
            }
        }

        // Check for diagonal win (top-left to bottom-right)
        if (xCoord === yCoord) {
            for (let i = 1; i <= 5; i++) {
                if (!bingoCard[i - 1][i - 1].isClicked) {
                    diagonalWin1 = false;
                    break;
                }
            }
        }

        // Check for diagonal win (top-right to bottom-left)
        if (xCoord + yCoord === 6) {
            for (let i = 1; i <= 5; i++) {
                if (!bingoCard[i - 1][5 - i].isClicked) {
                    diagonalWin2 = false;
                    break;
                }
            }
        }
    }

    // If any of the win conditions are true, return true
    if (verticalWin || horizontalWin || diagonalWin1 || diagonalWin2) {
        return true;
    }

    return false;
}
