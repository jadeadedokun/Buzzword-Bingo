import { BingoCell } from './BingoCell.js';
import { wasClicked, setBingoCard } from './gameFunctionality.js';

// Bingo board stored as a 2D array
let bingoCard = [];

// Function to fetch buzzwords from a text file
async function loadBuzzwords() {
    try {
        const response = await fetch("buzzwords.txt");
        const text = await response.text();
        return text.split("\n").map(word => word.trim()).filter(word => word.length > 0);
    } catch (error) {
        console.error("Error loading buzzwords:", error);
        return [];
    }
}

// Function to shorten long words for better display
function shortenIfNeeded(word) {
    // If the word is too long, shorten it
    if (word.length > 15) {
        return word.substring(0, 14) + "...";
    }
    return word;
}

// Function to generate a Bingo board using a 2D array
async function generateBingoBoard() {
    let words = await loadBuzzwords();
    if (words.length < 24) {
        console.error("Not enough buzzwords available!");
        return;
    }

    // Shuffle and select 24 words
    let selectedWords = words.sort(() => Math.random() - 0.5).slice(0, 24);
    selectedWords.splice(12, 0, "FREE SPACE"); // Place free space in the center

    bingoCard = []; // Reset the 2D bingo board

    let grid = document.getElementById("bingo-grid");
    grid.innerHTML = ""; // Clear previous grid
    
    // Reference to the middle button for the red circle
    let middleButtonElement = null;

    // Create the 2D BingoCard array and render it
    for (let row = 0; row < 5; row++) {
        let rowArray = [];
        for (let col = 0; col < 5; col++) {
            let cellNumber = (row + 1) * 10 + (col + 1); // Number format like 11, 12, 13...
            let word = selectedWords[row * 5 + col];
            let cell = new BingoCell(cellNumber, word);
            rowArray.push(cell); // Store in the 2D array

            // Create cell div
            let cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            
            // Create button with the buzzword
            let buttonElement = document.createElement("button");
            
            // If it's the FREE SPACE (middle cell), use the star button
            if (word === "FREE SPACE") {
                buttonElement.classList.add("button-star");
                cell.isClicked = true;
                
                let starIcon = document.createElement("i");
                starIcon.classList.add("fas", "fa-star");
                buttonElement.appendChild(starIcon);
                
                // Save reference to the middle button for the red circle
                middleButtonElement = buttonElement;
            } else {
                buttonElement.classList.add("button");
                // Shorten the text if it's too long
                buttonElement.textContent = shortenIfNeeded(word);
            }

            // Attach click event
            buttonElement.addEventListener("click", function(event) {
                wasClicked(cell, buttonElement, event);
            });

            cellElement.appendChild(buttonElement);
            grid.appendChild(cellElement);
        }
        bingoCard.push(rowArray); // Push row into the main 2D array
    }

    // Share the bingoCard with the gameFunctionality.js
    setBingoCard(bingoCard);
    
    // Position the red circle over the FREE SPACE after a slight delay
    // This ensures elements are rendered before positioning
    setTimeout(() => {
        if (middleButtonElement) {
            const buttonRect = middleButtonElement.getBoundingClientRect();
            const redCircle = document.getElementById("redCircle");
            
            redCircle.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
            redCircle.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
            redCircle.style.display = 'block';
        }
    }, 100);
}

// Generate a new bingo board when the page loads
window.onload = generateBingoBoard;