let GameBoard = (function() {
    //stores the current status of the gamef
    let gameBoardArray = Array(9).fill('');
    //                      top,     left,    right,    bottom, diag1,   diag2    mid-col  mid-row
    let winningPositions = [[0,1,2], [0,3,6], [2,5,8], [6,7,8], [0,4,8], [2,4,6], [1,4,7], [3,4,5]];
    let count = 0;
    let disablePlay = false; //stops the board if someone won
    let computerPlaying = false; //stops the board if computer is playing

    //create players with unique icons
    function Player() {
        this.wins = 0;
        this.computer = false;
    }

    let player1 = new Player();
    player1.name = 'Player 1'
    player1.icon = 'x'

    let player2 = new Player();
    player2.name = 'Player 2';
    player2.icon = 'o';
    player2.computer = true;

    //cache DOM
    let gameBoard = document.querySelector('#gameBoard');
    let resetBtn = document.querySelector('.reset');

    //initialize Game when Loaded
    (function init() {
        render();
        render();
    })();

    //add eventListeners
    gameBoard.addEventListener('click', addPiece);
    resetBtn.addEventListener('click', resetBoard)

    //bind events
    events.on('updateNames', updatePlayerNames);

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
        events.emit('currentPlayer', getCurrentPlayer(count))
    }

    function getCurrentPlayer(count) {
        return count % 2 === 0 ? player1 : player2;
    }

    //remove old board from gameBoard
    function removeAllChildren(parent) {
        while (parent.firstChild) {
            parent.lastChild.remove();
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

    function updatePlayerNames([p1Name, p2Name]) {
        console.log(p1Name);
        player1.name = p1Name;
        player2.name = p2Name;
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
        if (disablePlay) return;
        if (eventDelegation(e, 'DIV', 'grid')) {
            let parentCard = e.target;
            let gridID = parentCard.dataset.id;
            updateGameArray(gridID);
        } else if (e >= 0 && e < 9) {
            updateGameArray(e);
        } else {
            return;
        }
        if (checkForWin(gameBoardArray)) {
            win();
        } else if (count === 9) {
            tie();
        }
        render();
        if (checkForComputer()) {
            computerPlay();
        };
    }

    function checkForWin(array) {
        for (option of winningPositions) {
            if (areEqual(array, option)) {
                return true;
            }
        }
    }

    function win() {
        let currentPlayer = getCurrentPlayer(count - 1);
        // alert(`Game Over ${currentPlayer.name} wins!`);
        currentPlayer.wins += 1;
        events.emit('currentScore', [player1.wins, player2.wins]);
        disablePlay = true;
        events.emit('endGame', currentPlayer)
    }

    function tie() {
        if (!gameBoardArray.includes('')) {
            events.emit('endGame', 'Tie');
        }
    }

    function checkForComputer() {
        if (gameBoardArray.includes('') && getCurrentPlayer(count).computer && !disablePlay) {
            return true;
        }
    }

    function computerPlay() {
        disablePlay = true;
        computerPlaying = true;
        setTimeout(function(){
            disablePlay = false;
            computerPlaying = false;
            let location = findEmptySpace();
            addPiece(location);
        }, 500) //delay computer
    }

    function findEmptySpace() {
        let openSpaces = gameBoardArray.reduce(function(accumArray,currentVal,index){
            if (currentVal==='')
                accumArray.push(index)
            return accumArray;
        }, []);
        function getRandom(len) {
            return Math.floor(Math.random() * len - 1) + 1
        };
        function getRandomSample(array) {
            //randomly choose a space from the available spaces;
            let length = array.length;
            let index = getRandom(length);
            return array[index];
        }
        function checkForComputerWin() {
            let currentIcon = getCurrentPlayer(count).icon;
            return attemptWin(currentIcon);
        }

        function checkForUserWin() {
            let currentIcon = getCurrentPlayer(count).icon;
            let userIcon = currentIcon === 'x' ? 'o' : 'x';
            return attemptWin(userIcon);
        }

        function attemptWin(icon) {
            for (let space of openSpaces) {
                let tempArray = gameBoardArray.map(x=>x);
                tempArray[space] = icon;
                if (checkForWin(tempArray)) {
                    return space;
                }
            }
        }

        let location;
        if (checkForComputerWin()) {
            location = checkForComputerWin();
        } else if (checkForUserWin()) {
            location = checkForUserWin();
        } else {
            location = getRandomSample(openSpaces);
        }
        return location
    }

    function resetBoard() {
        if (computerPlaying) return;//disallow reset button from firing if computer is playing
        gameBoardArray = Array(9).fill('');
        count = 0;
        render();
        computerPlaying = false;
        disablePlay = false;
    }

    //check all winning combinations to see if there is 3 in a row
    function areEqual(mainArray, array) {
        let argument1 = mainArray[array[0]];
        let argument2 = mainArray[array[1]];
        let argument3 = mainArray[array[2]];
        if (argument1 !== '' && argument1 === argument2 && argument1=== argument3) {
            return true;
        }
        return false;
    }

    return {
        player1: player1,
        player2: player2,
        resetBoard: resetBoard,
    }

})();

(function UpdateUI() {
    //cache DOM
    let player1Display = document.querySelector('#player1');
    let player2Display = document.querySelector('#player2');
    let player1Name = player1Display.querySelector('.name');
    let player2Name = player2Display.querySelector('.name');
    let player1Score = player1Display.querySelector('.score');
    let player2Score = player2Display.querySelector('.score');
    let popup = document.querySelector('.popup');
    let popupWinner = popup.querySelector('#endGamePopup');
    let resetPopupBtn = popup.querySelector('#resetPopup');
    let closePopupBtn = popup.querySelector('#closePopup');

    //bind events
    events.on('currentPlayer', currentPlayerCSS)
    events.on('currentScore', updatePlayerScores)
    events.on('endGame', endGame)


    //add event listeners
    player1Name.addEventListener('click', updateName);
    player2Name.addEventListener('click', updateName);
    closePopupBtn.addEventListener('click', closePopup);
    resetPopupBtn.addEventListener('click', resetGame);

    function updateName(e) {
        let newName = prompt('What do you want as a new name?')
        if (newName == null) return;
        if (newName === '' || newName === ' ' ) return;
        e.target.textContent = newName;
        console.log('emitting')
        events.emit('updateNames', [player1Name.textContent, player2Name.textContent]);
    }

    function updatePlayerScores([p1score, p2score]) {
        player1Score.textContent = p1score;
        player2Score.textContent = p2score;
    }

     //toggle currentPlayer CSS class
     function currentPlayerCSS(currentPlayer) {
        if (currentPlayer === GameBoard.player1) {
            player1Name.classList.add('currentPlayer');
            player2Name.classList.remove('currentPlayer');
        } else {
            player2Name.classList.add('currentPlayer');
            player1Name.classList.remove('currentPlayer');
        }
    }

    function endGame(winner) {
        openPopup()
        if (winner === 'Tie') {
            popupWinner.textContent = "Tie!"
        } else {
            popupWinner.textContent = `${winner.name} Wins!`
        }

    }

    function openPopup() {
        popup.style.display = 'flex';
    }

    function closePopup() {
        popup.style.display = 'none';
    }

    function resetGame() {
        closePopup();
        GameBoard.resetBoard();
    }

})();