'use strict'

// // Prevent the context menu from appearing
window.addEventListener('contextmenu', function (e) {
    e.preventDefault() 
})

function createBoard(rows, cols, obj) {
    const board = []
    for (var i = 0; i < rows.length; i++) {
        board[i] = []
        for (var j = 0; j < cols[i].length; j++) {
            board[i][j] = obj
        }
    }
    return board
}


// getRamdomInt
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}