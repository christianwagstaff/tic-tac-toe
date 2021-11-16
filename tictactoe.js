let GameBoard = (function() {

    let gameBoardArray = ['x','o','o','x','x','o','o','x','o'];

    //cache DOM
    let gameBoard = document.querySelector('#gameBoard');

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

    function addPiece(e) {

    }


    //initalize
    createGrid();
})();