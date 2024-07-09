document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset-button');
    const message = document.getElementById('message');
    const gameModeButtons = document.getElementsByName('valueIs-radio');
    let board = Array(9).fill(null);
    let currentPlayer = 'Player 1';
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

        board[index] = currentPlayer === 'Player 1' ? 'X' : 'O';
        event.target.textContent = board[index];
        if (checkWin()) {
            if (gameMode === 'player-vs-ai' && currentPlayer === 'Player 1') {
                message.textContent = 'You win!';
            } else {
                message.textContent = `${currentPlayer} wins!`;
            }
            isGameActive = false;
            return;
        }

        if (board.every(cell => cell !== null)) {
            message.textContent = 'Draw!';
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
        if (gameMode === 'player-vs-ai' && currentPlayer === 'Player 2') {
            makeAiMove(); // Immediate AI move
        } else {
            updateTurnMessage(); // Update turn message for player vs. player mode
        }
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === (currentPlayer === 'Player 1' ? 'X' : 'O'));
        });
    }

    function makeAiMove() {
        let availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        let aiMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[aiMove] = 'O';
        cells[aiMove].textContent = 'O';

        if (checkWin()) {
            message.textContent = 'AI wins!';
            isGameActive = false;
            return;
        }

        if (board.every(cell => cell !== null)) {
            message.textContent = 'Draw!';
            isGameActive = false;
            return;
        }

        currentPlayer = 'Player 1';
        updateTurnMessage(); // Update turn message after AI move
    }

    function resetGame() {
        board = Array(9).fill(null);
        isGameActive = true;
        currentPlayer = 'Player 1';
        cells.forEach(cell => cell.textContent = '');
        message.textContent = '';
        updateTurnMessage(); // Update turn message after reset
    }

    function updateTurnMessage() {
        if (gameMode === 'player-vs-player' && isGameActive) {
            message.textContent = `It's ${currentPlayer}'s turn`;
        }
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

    updateTurnMessage(); // Initial turn message update
});
