'use strict'

var gClickedMinesCount = gLevel.LIVES

function placeMines(board, mines, firstClickRow, firstClickCol) {
    while (mines > 0) {
        // const i = getRandomInt(0, board.length)
        // const j = getRandomInt(0, board[0].length)

        const emptyCell = getRandomEmptyCell(board)

        if (!emptyCell) break

        const i = emptyCell.i
        const j = emptyCell.j


        if (i === firstClickRow && j === firstClickCol) continue

        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            mines--
        }
    }
}

function renderAfterMines(board) {
    const elBoard = document.querySelector('.board')
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const elCell = elBoard.querySelector(`.cell-${i}-${j}`)

            if (currCell.isMine) {
                elCell.classList.add('mine')
            }
        }
    }

}

// store mines count in the model
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (!currCell.isMine) {
                const minesAroundCount = countNeighborAround(board, i, j)
                currCell.minesAroundCount = minesAroundCount

                // renderNegCount(i, j)                         // render DOM
            }
        }
    }
}

// render neg count and display in DOM (show number of neg mines on each clicked cell)
function renderNegCount(i, j) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    const negMinesCount = gBoard[i][j].minesAroundCount
    if (negMinesCount === 0) return
    elCell.innerHTML = negMinesCount
}

// checks if a cell is clear from neg mines -- used in onCellClicked
function clearFromNegMines(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 && j >= board[i].length) continue
            var currCell = board[i][j]

            if (currCell && currCell.isMine) return false
        }
    }
    return true
}

function toggleManualMode() {
    gGame.isManualMode = !gGame.isManualMode

    if (gGame.isManualMode) {
        const elManualModeBtn = document.querySelector('.manual-mode-btn')
        elManualModeBtn.classList.add('manual-mode')
        console.log("manual mode on")
    } else {
        const elManualModeBtn = document.querySelector('.manual-mode-btn')
        elManualModeBtn.classList.remove('manual-mode')
        console.log("manual mode off")
    }
}

function placeMinesManualy(board, i, j) {
    if (board[i][j].isMine) return
    board[i][j].isMine = true

    const elBoard = document.querySelector('.board')
    const elCell = elBoard.querySelector(`.cell-${i}-${j}`)
    elCell.classList.add('mine')
    elCell.classList.add('manual-mine')
    console.log('mine:')
    elCell.innerHTML = MINE

    gGame.manualMinesCount--
    console.log('gGame.manualMinesCount:', gGame.manualMinesCount)
}

function hideMinesManualy(board, i, j) {

    const elBoard = document.querySelector('.board')
    const elCell = elBoard.querySelector(`.cell-${i}-${j}`)

    elCell.classList.remove('marked-mine')
    elCell.innerHTML = ''
}

function removeAllMarkedManualMines(board) {
    const elBoard = document.querySelector('.board')
    const elCells = elBoard.querySelectorAll('.manual-mine')

    for (var i = 0; i < elCells.length; i++) {
        elCells[i].classList.remove('manual-mine')
    }
}