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

// Function to format words properly
function formatText(word) {
    // If it's a multi-word term (with space), split into two lines
    if (word.includes(" ")) {
        const words = word.split(" ");
        
        // If just two words, put each on its own line
        if (words.length === 2) {
            return words.join("<br>");
        } 
        // For more words, try to split evenly
        else {
            const midIndex = Math.ceil(words.length / 2);
            const firstPart = words.slice(0, midIndex).join(" ");
            const secondPart = words.slice(midIndex).join(" ");
            return firstPart + "<br>" + secondPart;
        }
    }
    
    // For single long words, add a line break in the middle
    if (word.length > 10) {
        const midIndex = Math.ceil(word.length / 2);
        return word.slice(0, midIndex) + "<br>" + word.slice(midIndex);
    }
    
    // Short single words don't need splitting
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
            } else {
                buttonElement.classList.add("button");
                
                // Format the word so it fits well in the cell
                buttonElement.innerHTML = formatText(word);
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
}

// Generate a new bingo board when the page loads
window.onload = generateBingoBoard;