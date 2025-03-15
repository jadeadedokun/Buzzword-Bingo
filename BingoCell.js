export class BingoCell {
    constructor(cellNumber, cellWord) {
        this.isClicked = false; // Tracks if the cell is clicked
        this.cellName = `button${cellNumber}`; // Unique button ID
        this.word = cellWord; // Word assigned to this cell
    }

    toggle() {
        this.isClicked = !this.isClicked; // Toggle state
    }
}