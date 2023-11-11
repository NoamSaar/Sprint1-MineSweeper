'use strict'

var gClickedMinesCount = gLevel.LIVES

function placeMines(board, mines, firstClickRow, firstClickCol) {
    while (mines > 0) {
        const emptyCell = getRandomCell(board, (cell) => !cell.isMine)

        if (!emptyCell) break

        const i = emptyCell.i
        const j = emptyCell.j


        if (i === firstClickRow && j === firstClickCol) continue

        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            mines--
        }
    }

    gGameMoves.push(copyBoard(gBoard))
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

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (!currCell.isMine) {
                const minesAroundCount = countNeighborAround(board, i, j)
                currCell.minesAroundCount = minesAroundCount
            }
        }
    }
}

function renderNegCount(i, j) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    const negMinesCount = gBoard[i][j].minesAroundCount
    if (negMinesCount === 0) return
    elCell.innerHTML = negMinesCount
}

function IsclearFromNegMines(board, rowIdx, colIdx) {
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

function displayAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('marked-mine')         // DOM
                elCell.innerHTML = MINE
            }
        }
    }
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
    elCell.classList.add('manual-mark')
    console.log('mine:')
    elCell.innerHTML = MINE

    gGame.manualMinesCount--
    console.log('gGame.manualMinesCount:', gGame.manualMinesCount)
}

function hideMinesManualy(i, j) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)

    elCell.classList.remove('marked-mark')
    elCell.innerHTML = ''
}

function removeAllMarkedManualMines() {
    const elCells = document.querySelectorAll('.manual-mark')

    for (var i = 0; i < elCells.length; i++) {
        elCells[i].classList.remove('manual-mark')
    }
}

function exterminateMines() {
    toggleDisabledBtn('mine-ex-btn', 'mine-exterminator', 'add', false)
    if (!gGame.isOn || gGame.isFirstClick) return
    
    const MinesToTerminate = gLevel.MINES === 2 ? 1 : 3
    
    for (var i = 0; i < MinesToTerminate; i++) {
        const mineCell = getRandomCell(gBoard, (cell) => cell.isMine)
        
        const elCell = document.querySelector(`.cell-${mineCell.i}-${mineCell.j}`)
        elCell.classList.add('marked-mine')
        setTimeout(() => {
            elCell.classList.remove('marked-mine')
            toggleDisabledBtn('mine-ex-btn', 'mine-exterminator', 'remove', false)
            toggleDisabledBtn('mine-ex-btn', 'no-left', 'add', true)
        }, 2000)

        gBoard[mineCell.i][mineCell.j].isMine = false
        gBonus.terminatedMinesCount++
    }
    setMinesNegsCount(gBoard)
    renderAfterMines(gBoard)

}