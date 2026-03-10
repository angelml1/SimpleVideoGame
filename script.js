// Board dimensions for Connect 4
const ROWS = 6;
const COLS = 7;

// Game state matrix:
// 0 = empty cell, 1 = red player, 2 = yellow player
let board = [];
let cells = [];

//red player first
let currentPlayer = 1;

// Cache key DOM elements once
const boardDiv = document.getElementById('board');
const turnInfo = document.getElementById('turn-info');
const restartBtn = document.getElementById('restart-btn');

// Initialize the game
function initGame() {
    
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

   
    cells = Array.from({ length: ROWS }, () => Array(COLS));

    // Clear rendered board in the DOM
    boardDiv.innerHTML = '';
    
    // Build visual grid and attach click handlers
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Store row and col as data attributes 
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Clicking any cell in a column drops a piece in that column
            cell.addEventListener('click', () => placePiece(c));

            boardDiv.appendChild(cell);

            // Save DOM reference for this position
            cells[r][c] = cell; // store reference
        }
    }

    // Reset to red player's turn
    currentPlayer = 1;
    turnInfo.textContent = "Red's Turn";
}

// Place a piece in a column
function placePiece(col) {
    // Find the lowest available row in the selected column
    let rowToPlace = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            rowToPlace = r;
            break;
        }
    }

    // If column is full ignore click
    if (rowToPlace === -1) return;

    // Update game state with current player's piece
    board[rowToPlace][col] = currentPlayer;

    // Update UI color for the placed piece
    cells[rowToPlace][col].classList.add(currentPlayer === 1 ? 'red' : 'yellow');

    // Check if this move wins the game
    if (checkWin(rowToPlace, col)) {
        const winner = currentPlayer === 1 ? 'Red Player' : 'Yellow Player';

       
        setTimeout(() => alert(`${winner} wins!`), 100);
        return;
    }

    // Swap turns: red and yellow alternate
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    // Update turn label
    turnInfo.textContent = `${currentPlayer === 1 ? 'Red' : 'Yellow'}'s Turn`;
}

// Check whether the latest placed piece created 4 in a row
function checkWin(row, col) {
    // Direction vectors 
    // horizontal, vertical, diagonal down-right, diagonal down-left
    const directions = [
        { r: 0, c: 1 }, { r: 1, c: 0 },
        { r: 1, c: 1 }, { r: 1, c: -1 }
    ];

    // For each direction, count matching pieces both forward and backward
    for (let {r: dr, c: dc} of directions) {
        let count = 1; // start with the just-placed piece

        // Forward scan
        for (let i = 1; i < 4; i++) {
            const nr = row + dr * i;
            const nc = col + dc * i;

            // Stop if out of bounds
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;

            // Continue counting if same player's piece
            if (board[nr][nc] === currentPlayer) count++;
            else break;
        }

        // Backward scan
        for (let i = 1; i < 4; i++) {
            const nr = row - dr * i;
            const nc = col - dc * i;

            // Stop if out of bounds
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;

            // Continue counting if same player's piece
            if (board[nr][nc] === currentPlayer) count++;
            else break;
        }

        // Win condition if 4 or more connected pieces
        if (count >= 4) return true;
    }

    // No winning line found
    return false;
}

// Restart button
restartBtn.addEventListener('click', initGame);

// Start game when page finishes loading
window.onload = initGame;