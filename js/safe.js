'use strict'

function safeClick() {
    if (gGame.isFirstClick || !gBonus.totalSafeCount) return
    changeSafeLook()
    revealSafeCell(gBoard)

    gBonus.totalSafeCount--
    if (gBonus.totalSafeCount === 0) {
        gBonus.totalSafeCount = null

        setTimeout(() => {
            const elSafeBtn = document.querySelector('.safe-btn')
            elSafeBtn.classList.add('no-left')
            elSafeBtn.disabled = true
        }, 1500)
    }

    const elTotalSafeCount = document.querySelector('.safe-count')
    elTotalSafeCount.innerHTML = gBonus.totalSafeCount
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