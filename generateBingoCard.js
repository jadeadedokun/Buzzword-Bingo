// BingoCell constructor
function BingoCell(cellNumber, cellWord) {
    this.isClicked = false; // Tracks if the cell is clicked
    this.cellName = `button${cellNumber}`; // Unique button ID
    this.word = cellWord;
}

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

// Function to generate a Bingo board using a 2D array
async function generateBingoBoard() {
    let words = await loadBuzzwords();
    if (words.length < 24) {
        console.error("Not enough buzzwords available!");
        return;
    }

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

            let cellElement = document.createElement("div");
            cellElement.classList.add("bingo-cell");
            cellElement.id = cell.cellName;
            cellElement.textContent = cell.word;

            if (word === "FREE SPACE") {
                cell.isClicked = true;
                cellElement.classList.add("marked");
            }

            // Attach click event
            cellElement.addEventListener("click", () => toggleCell(cell, cellElement));

            grid.appendChild(cellElement);
        }
        bingoCard.push(rowArray); // Push row into the main 2D array
    }
}

// Function to toggle cell selection
function toggleCell(cell, cellElement) {
    cell.isClicked = !cell.isClicked; // Toggle state
    cellElement.classList.toggle("marked", cell.isClicked);
}

// Generate a new bingo board when the page loads
window.onload = generateBingoBoard;