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

function getRandomEmptyCell(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            if (!cell.isMine) {
                emptyCells.push({ i, j })
            }
        }
    }

    if (emptyCells.length === 0) return null

    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}


function renderCell(location, value, bollean, className) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    if (!value) value = ''
    elCell.innerHTML = value


    if(bollean) {
        elCell.classList.add(className)
    } else {
        elCell.classList.remove(className)
    }
}

// function renderCell(location, value) {
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

// getRamdomInt
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}