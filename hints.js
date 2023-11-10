'use strict'

const HINTS = '🔦'

function generateHints(count) {
    for (var i = 0; i < count; i++) {
        const elHints = document.querySelector(`.hint${i + 1}`)
        elHints.innerHTML = HINTS
    }
}

function changeHintLook(i) {
    const elHintBtn = document.querySelector(`.hint${i}`)

    if (elHintBtn.classList.contains('hint-used')) {
        elHintBtn.classList.remove('hint-used')
        gBonus.hintsNum = null
        gBonus.useHint = false
    } else {
        elHintBtn.classList.add('hint-used')
        gBonus.hintsNum = i
        gBonus.useHint = true
    }
}

function useHints(i, j) {
    const currCell = gBoard[i][j]

    if (!gGame.isOn || !currCell || currCell.isShownif || gGame.isFirstClick) return

    // revealNeg(gBoard, i, j)
    revealCellAndNeighbors(i, j)

    setTimeout(() => {
        // console.log("Removing hint:", gBonus.hintsNum)
        removeHint(gBonus.hintsNum)
        hideRevealedCells(i, j)
    }, 1000)
}

function revealCellAndNeighbors(rowIdx, colIdx) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    elCell.classList.add('hint-revealed')

    const cellClicked = gBoard[rowIdx][colIdx]
    elCell.innerHTML = cellClicked.minesAroundCount


    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const currCell = gBoard[i][j]
            const elNeighborCell = document.querySelector(`.cell-${i}-${j}`)
            if (!currCell.isShown && !currCell.isMarked) {
                if (currCell.isMine) {
                    elNeighborCell.innerHTML = MINE
                } else if (currCell.minesAroundCount === 0) {
                    elNeighborCell.innerHTML = ''
                } else {
                    elNeighborCell.innerHTML = currCell.minesAroundCount
                }
                elNeighborCell.classList.add('hint-revealed')
            }
        }
    }
}

function hideRevealedCells(rowIdx, colIdx) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    elCell.classList.remove('hint-revealed', 'marked-mine', 'marked-not-mine')
    elCell.innerHTML = ''
    // console.log('hide clicked cell:', gGame.shownCount)
    
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const currCell = gBoard[i][j]
            const elNeighborCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.isMarked) continue
            if (!currCell.isShown || elNeighborCell.classList.contains('hint-revealed')) {
                elNeighborCell.classList.remove('hint-revealed', 'marked-mine', 'marked-not-mine')
                elNeighborCell.innerHTML = ''
                // console.log(`hide ${i}-${j}`, gGame.shownCount)
            }
        }
    }
    gBoard[rowIdx][colIdx].isShown = false
    // console.log('final gGame.shownCount', gGame.shownCount)
}

function removeHint(i) {
    // console.log("Removing hint element:", i)
    const elHint = document.querySelector(`.hint${i}`)
    elHint.classList.add('hidden')
}

function clearhints() {
    for (var i = 0; i < gBonus.hintsCount; i++) {
        const elHint = document.querySelector(`.hint${i + 1}`)
        elHint.classList.remove('hint-used')
    }
}