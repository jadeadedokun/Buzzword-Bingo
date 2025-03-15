function BingoCell(cellNumber, cellWord){
    this.isClicked = false;
    this.cellName = `button${cellNumber}`;
    this.word = cellWord;
}