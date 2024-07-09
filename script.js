document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset-button');
    const message = document.getElementById('message');
    const gameModeButtons = document.getElementsByName('valueIs-radio');
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let isGameActive = true;
    let gameMode = 'player-vs-player';

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleClick(event) {
        const index = event.target.dataset.index;

        if (board[index] || !isGameActive) {
            return;
        }

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        if (checkWin()) {
            message.textContent = `${currentPlayer} wins!`;
            isGameActive = false;
            return;
        }

        if (board.every(cell => cell !== null)) {
            message.textContent = 'Draw!';
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameMode === 'player-vs-ai' && currentPlayer === 'O') {
            makeAiMove();
        }
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === currentPlayer);
        });
    }

    function makeAiMove() {
        let availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        let aiMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[aiMove] = 'O';
        cells[aiMove].textContent = 'O';

        if (checkWin()) {
            message.textContent = 'O wins!';
            isGameActive = false;
            return;
        }

        if (board.every(cell => cell !== null)) {
            message.textContent = 'Draw!';
            isGameActive = false;
            return;
        }

        currentPlayer = 'X';
    }

    function resetGame() {
        board = Array(9).fill(null);
        isGameActive = true;
        currentPlayer = 'X';
        cells.forEach(cell => cell.textContent = '');
        message.textContent = '';
    }

    gameModeButtons.forEach(button => {
        button.addEventListener('change', (event) => {
            if (event.target.checked) {
                gameMode = event.target.value;
                resetGame();
            }
        });
    });

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame);
});
