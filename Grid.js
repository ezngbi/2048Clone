const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

// --grid - size: 4;
// --cell - size: 20vmin;
// --cell - gap: 2vmin;

export default class Grid {
    //make it private so that later on user cant change the grid cells
    #cells

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE));
        });
    }

    get cells() {
        return this.#cells;
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, [])
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;
        }, [])
    }

    //getter function
    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null);
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}

class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }

    // setter function
    set tile(value) {
        this.#tile = value;
        if (value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if (value == null) {
            return;
        }

        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile) {
        //if there is a blank space then just move to that space else if there was no merging occur and the 2 values are the same then move then move them to the space
        return (this.tile == null ||
            (this.mergeTile == null && this.tile.value === tile.value))
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }
}

function createCellElements(gridElement) {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div")
        cell.classList.add("cell");
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}