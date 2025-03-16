// gameFunctionality.js

import { insertScore, updateWordClick } from "populateDB.js";

// Global bingoCard variable that will be set from generateBingoCard.js
let bingoCard = [];
let generateBoardFunction = null; // Store reference to the generateBingoBoard function

export function setBingoCard(card) {
    bingoCard = card;
}

// New function to store reference to the generateBingoBoard function
export function setGenerateBoardFunction(func) {
    generateBoardFunction = func;
}

export function wasClicked(cell, buttonElement, event) {
    // Toggle the clicked state of the BingoCell
    cell.toggle();

    // log word click to database
    updateWordClick(cell.word);
    
    // Get the position of the clicked button for the red circle
    const buttonRect = buttonElement.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Find the red circle in the DOM, or create one if it doesn't exist
    let redCircle = buttonElement.querySelector('.red-circle');

    // If the red circle doesn't exist, create one
    if (!redCircle) {
        redCircle = document.createElement('div');
        redCircle.classList.add('red-circle');
        
        // Position the red circle absolutely within the button
        redCircle.style.position = 'absolute';
        redCircle.style.top = '50%';
        redCircle.style.left = '50%';
        redCircle.style.transform = 'translate(-50%, -50%)';
        
        // Append the red circle to the button
        buttonElement.style.position = 'relative';
        buttonElement.appendChild(redCircle);
    }

    // Toggle the red circle's visibility based on cell's clicked state
    if (cell.isClicked && !buttonElement.classList.contains('button-star')) {
        redCircle.style.display = 'block';
        // Maintain white background and original text color when clicked
        buttonElement.style.backgroundColor = 'rgb(255, 255, 255)';
        buttonElement.style.color = 'rgb(48, 61, 143)';
    } else {
        redCircle.style.display = 'none';
    }

    // Check if this click results in a win
    if (hasWon(cell)) {
        // Create a win container to hold all win elements
        const winContainer = document.createElement('div');
        winContainer.id = 'win-container';
        winContainer.style.position = 'fixed';
        winContainer.style.top = '0';
        winContainer.style.left = '0';
        winContainer.style.width = '100%';
        winContainer.style.height = '100%';
        winContainer.style.display = 'flex';
        winContainer.style.flexDirection = 'column';
        winContainer.style.justifyContent = 'center';
        winContainer.style.alignItems = 'center';
        winContainer.style.zIndex = '1000';
        
        // Create background blur overlay
        const blurOverlay = document.createElement('div');
        blurOverlay.style.position = 'fixed';
        blurOverlay.style.top = '0';
        blurOverlay.style.left = '0';
        blurOverlay.style.width = '100%';
        blurOverlay.style.height = '100%';
        blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        blurOverlay.style.zIndex = '999';
        blurOverlay.style.backdropFilter = 'blur(5px)';

        // Create the win image
        const winImage = document.createElement('img');
        winImage.src = 'pngtree-bingo-ball-png-image_6462732.png';
        winImage.alt = 'Congratulations! You win!';
        winImage.style.maxWidth = '80%';
        winImage.style.maxHeight = '60%';
        winImage.style.zIndex = '1001';

        // Create Restart Button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.style.marginTop = '20px';
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '40px';
        restartButton.style.backgroundColor = 'rgb(34, 43, 105)';
        restartButton.style.color = 'white';
        restartButton.style.border = '2px solid rgb(34, 43, 105)';
        restartButton.style.borderRadius = '40px';
        restartButton.style.fontFamily = 'Copperplate';
        restartButton.style.cursor = 'pointer';
        restartButton.style.zIndex = '1002';

        // Hover effects
        restartButton.addEventListener('mouseover', function() {
            restartButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            restartButton.style.color = 'rgb(34, 43, 105)'; 
        });

        restartButton.addEventListener('mouseout', function() {
            restartButton.style.backgroundColor = 'rgb(34, 43, 105)';
            restartButton.style.color = 'rgb(255, 255, 255)';
        });

        // Restart game functionality
        restartButton.addEventListener('click', function() {
            // Remove the entire win container (blurOverlay and all win elements)
            document.body.removeChild(winContainer);
            document.body.removeChild(blurOverlay);
            
            // Reset the current Bingo Card
            resetBingoCard();
        });

        // Append elements to the container and body
        winContainer.appendChild(winImage);
        winContainer.appendChild(restartButton);
        document.body.appendChild(blurOverlay);
        document.body.appendChild(winContainer);
    }
}

// New function to reset the Bingo Card
function resetBingoCard() {
    // Reset cells
    let buttons = document.querySelectorAll('#bingo-grid .cell button');
    buttons.forEach(button => {
        // Remove red circles
        const redCircle = button.querySelector('.red-circle');
        if (redCircle) {
            button.removeChild(redCircle);
        }

        // Reset button styles for non-star buttons
        if (!button.classList.contains('button-star')) {
            button.style.backgroundColor = 'rgb(255, 255, 255)';
            button.style.color = 'rgb(48, 61, 143)';
        }
    });

    // Regenerate the board
    if (generateBoardFunction) {
        generateBoardFunction();
    } else {
        console.error("Generate board function not set");
        location.reload();
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

    if (horizontalWin || verticalWin || diagonalWin1 || diagonalWin2) {
        let playerName = localStorage.getItem("playerName");
        let timeTaken = calculateGameTime();
        insertScore(playerName, timeTaken);
    }

    // Return true if any win condition is met
    return horizontalWin || verticalWin || diagonalWin1 || diagonalWin2;
}