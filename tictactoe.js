let GameBoard = (function() {
    //stores the current status of the gamef
    let gameBoardArray = Array(9).fill('');
    //                      top,     left,    right,    bottom, diag1,   diag2    mid-col  mid-row
    let winningPositions = [[0,1,2], [0,3,6], [2,5,8], [6,7,8], [0,4,8], [2,4,6], [1,4,7], [3,4,5]];
    let count = 0;

    //create players with unique icons
    function Player() {
        this.wins = 0;
        this.computer = false;
    }

    let player1 = new Player();
    player1.name = 'You'
    player1.icon = 'x'

    let player2 = new Player();
    player2.name = 'Player 2';
    player2.icon = 'o';

    function getCurrentPlayer(count) {
        return count % 2 === 0 ? player1 : player2;
    }

    //cache DOM
    let gameBoard = document.querySelector('#gameBoard');
    let player1Display = document.querySelector('#player1');
    let player2Display = document.querySelector('#player2');
    let player1Name = player1Display.querySelector('.name');
    let player2Name = player2Display.querySelector('.name');
    let player1Score = player1Display.querySelector('.score');
    let player2Score = player2Display.querySelector('.score');


    //initialize Game when Loaded
    function init() {
        player1Name.textContent = player1.name;
        player2Name.textContent = player2.name;
        render();
    }

    //add eventListeners
    gameBoard.addEventListener('click', addPiece);

    //create the Board
    function createGridPiece() {
        let item = document.createElement('div');
        item.classList.add('grid');
        return item;
    }

    function createGrid() {
        for (let i = 0; i < 9; i++) {
            let grid = createGridPiece();
            grid.id = `grid${i}`;
            grid.dataset.id = i;
            grid.textContent = gameBoardArray[i];
            gameBoard.appendChild(grid);
        }
    }

    //render Board to Screen
    function render() {
        removeAllChildren(gameBoard);
        createGrid();
        currentPlayerCSS();
    }

    //remove old board from gameBoard
    function removeAllChildren(parent) {
        while (parent.firstChild) {
            parent.lastChild.remove();
        }
    }

    //toggle currentPlayer CSS class
    function currentPlayerCSS() {
        if (getCurrentPlayer(count) === player1) {
            player1Name.classList.add('currentPlayer');
            player2Name.classList.remove('currentPlayer');
        } else {
            player2Name.classList.add('currentPlayer');
            player1Name.classList.remove('currentPlayer');
        }
    }


    //allows grid pieces to be dymanically added with event listeners
    function eventDelegation(event, nodeType, className) {
        //attaching eventListeners to the main books div, checks if target is what we want
        if (event.target && event.target.nodeName === nodeType) {
            if (event.target.classList.contains(className)) {
                return true;
            }
        }
    }

    function updateGameArray(gridID) {
        let arrayLocation = gameBoardArray[gridID];
        if (arrayLocation === '') {
            let playerIcon;
            if (count % 2 === 0) {
                playerIcon = player1.icon;
            } else {
                playerIcon = player2.icon;
            }
            gameBoardArray[gridID] = playerIcon;
            count++;
        } 
    }

    function addPiece(e) {
        if (eventDelegation(e, 'DIV', 'grid')) {
            let parentCard = e.target;
            let gridID = parentCard.dataset.id;
            updateGameArray(gridID);
        } else if (e >= 0 && e < 9) {
            updateGameArray(e);
        } else {
            return;
        }
        render();
        checkForWin();
    }

    function checkForWin() {
        for (option of winningPositions) {
            if (areEqual(option)) {
                win();
            }
        }
    }

    function win() {
        let currentPlayer = getCurrentPlayer(count - 1);
        alert(`Game Over ${currentPlayer.name} wins!`);
        currentPlayer.wins += 1;
        console.log(currentPlayer.wins)
        displayCurrentWins();
        resetBoard();
    }

    function displayCurrentWins(){
        player1Score.textContent = player1.wins;
        player2Score.textContent = player2.wins;
    }

    function resetBoard() {
        gameBoardArray = Array(9).fill('');
        count = 0;
        render();
    }

    //check all winning combinations to see if there is 3 in a row
    function areEqual(array) {
        let argument1 = gameBoardArray[array[0]];
        let argument2 = gameBoardArray[array[1]];
        let argument3 = gameBoardArray[array[2]];
        if (argument1 !== '' && argument1 === argument2 && argument1=== argument3) {
            return true;
        }
        return false;
    }

    //initalize
    init();

    return {
        addPiece: addPiece,
    }
})();