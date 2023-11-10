'use strict'

function safeClick() {
    if (gGame.isFirstClick || !gBonus.safeCount) return
    changeSafeLook()
    revealSafeCell(gBoard)

    gBonus.safeCount--
    if (gBonus.safeCount === 0) {
        gBonus.safeCount = null

        setTimeout(() => {
            const elSafeBtn = document.querySelector('.safe-btn')
            elSafeBtn.classList.add('no-left')
            elSafeBtn.disabled = true
        }, 1500)
    }

    const elSafeCount = document.querySelector('.safe-count')
    elSafeCount.innerHTML = gBonus.safeCount
}

function revealSafeCell(board) {
    var emptyCell = getRandomCell(board, (cell) => !cell.isMine)

    if (!emptyCell) return

    var isCellShown = gBoard[emptyCell.i][emptyCell.j].isShown

    while (isCellShown) {
        emptyCell = getRandomCell(board, (cell) => !cell.isMine)
        isCellShown = gBoard[emptyCell.i][emptyCell.j].isShown
    }

    const cellContent = gBoard[emptyCell.i][emptyCell.j].minesAroundCount

    renderCell(emptyCell, cellContent, true, 'hint-revealed')

    setTimeout(() => {
        renderCell(emptyCell, null, false, 'hint-revealed')
    }, 1500)
}

function changeSafeLook() {
    const elSafeBtn = document.querySelector(`.safe-click`)

    if (elSafeBtn.classList.contains('safe-used')) {
        elSafeBtn.classList.remove('safe-used')
        gBonus.useSafe = false
    } else {
        elSafeBtn.classList.add('safe-used')
        gBonus.useSafe = true

        setTimeout(() => {
            elSafeBtn.classList.remove('safe-used')
        }, 1500)
    }
}