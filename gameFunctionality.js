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
        //alert("Bingo! You've won!");
        // Create an image element
        const winImage = document.createElement('img');
        
        // Set the image source (replace 'your-image-url.jpg' with your actual image URL or file path)
        winImage.src = 'pngtree-bingo-ball-png-image_6462732.png';
        
        // Set the alt text (for accessibility)
        winImage.alt = 'Congratulations! You win!';
        
        // Style the image (optional, adjust as necessary)
        winImage.style.position = 'absolute';
        winImage.style.top = '50%'; // Position it in the center
        winImage.style.left = '50%';
        winImage.style.transform = 'translate(-50%, -50%)'; // Center it perfectly
        winImage.style.zIndex = '10'; // Make sure it appears on top of other elements
        winImage.style.maxWidth = '80%'; // Adjust the image size (optional)
        winImage.style.maxHeight = '80%'; // Adjust the image size (optional)

        // Append the image to the body (or a specific container)
        document.body.appendChild(winImage);

        // Create a Restart Button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.style.position = 'absolute';
        restartButton.style.top = '65%';  // Position below the image
        restartButton.style.left = '50%';
        restartButton.style.transform = 'translateX(-50%)'; // Center horizontally
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '20px';
        restartButton.style.backgroundColor = 'rgb(48, 61, 143)';
        restartButton.style.color = 'white';
        restartButton.style.border = 'none';
        restartButton.style.cursor = 'pointer';
        restartButton.style.zIndex = '10000'; // Make sure it's above other content

        // Style the button on hover
        restartButton.addEventListener('mouseover', function() {
            restartButton.style.backgroundColor = 'rgb(255, 217, 0)'; // Change on hover
        });

        restartButton.addEventListener('mouseout', function() {
            restartButton.style.backgroundColor = 'rgb(48, 61, 143)'; // Revert back
        });

        // Append the button to the body (or a specific container)
        document.body.appendChild(restartButton);

        // Add event listener to restart the game when the button is clicked
        restartButton.addEventListener('click', function() {
            // Optionally, you can remove the current grid and reset the game here
            // Clear the existing game board
            document.getElementById('bingo-grid').innerHTML = '';  // Clear the grid
            bingoCard = []; // Reset the bingo card array
            
            // Remove the win image and restart button
            winImage.remove();
            restartButton.remove();

            // Call the function to generate a new Bingo board
            generateBingoBoard(); // This will re-generate the Bingo board
        });
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