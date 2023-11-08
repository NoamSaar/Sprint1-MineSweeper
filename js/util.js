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

function getRandomEmptyCell(ELEMENT) {
    const emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            if (cell !== ELEMENT) {
                emptyCells.push({ i, j })
            }
        }
    }

    if (emptyCells.length === 0) return null

    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function renderCell(location, value) {
    // location is an object like this - { i: 2, j: 7 }
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    // OR:       = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerHTML = value
}

// getRamdomInt
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}