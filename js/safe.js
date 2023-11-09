'use strict'

function safeClick() {
    if (gGame.isFirstClick || !gBonus.safeCount) return
    changeSafeLook()
    revealSafeCell(gBoard)

    gBonus.safeCount--
    if (gBonus.safeCount === 0) gBonus.safeCount = null

    const elSafeSpan = document.querySelector('.safe-count')
    elSafeSpan.innerHTML = gBonus.safeCount
    // console.log('gBonus.safeCount:', gBonus.safeCount)
}

function revealSafeCell(board) {
    var emptyCell = getRandomEmptyCell(board)

    if (!emptyCell) return

    var isCellShown = gBoard[emptyCell.i][emptyCell.j].isShown
    
    while (isCellShown) {
        emptyCell = getRandomEmptyCell(board)
        isCellShown = gBoard[emptyCell.i][emptyCell.j].isShown
    }

    const cellContent = gBoard[emptyCell.i][emptyCell.j].minesAroundCount
    // console.log('cellContent:', cellContent)

    renderCell(emptyCell, cellContent, true, 'hint-revealed')
    // console.log('gBonus.safeCount:', gBonus.safeCount)

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