'use strict'

const HINTS = '💡'

function generateHints(HINTS) {
    for (var i = 0; i < gBonus.hintsCount; i++) {
        const elHints = document.querySelector(`.hint${i + 1}`)
        elHints.innerHTML = HINTS
    }
}

function changeHintLook(i) {
    const elHint = document.querySelector(`.hint${i}`)

    if (elHint.classList.contains('hint-used')) {
        elHint.classList.remove('hint-used')
        gBonus.hintsNum = null
        gBonus.useHint = false
    } else {
        elHint.classList.add('hint-used')
        gBonus.hintsNum = i
        gBonus.useHint = true
    }
}

// function useHints(i, j) {
//     const currCell = gBoard[i][j]

//     if (!gGame.isOn || !currCell || currCell.isShown) return

//     // revealNeg(gBoard, i, j)
//     revealCellAndNeighbors(i, j)

//     setTimeout(() => {
//         // console.log("Removing hint:", gBonus.hintsNum)
//         removeHint(gBonus.hintsNum)
//         hideRevealedCells(i, j)
//     }, 1000)
// }

// var gRevealedCount = 0
// function revealCellAndNeighbors(rowIdx, colIdx) {
//     const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
//     elCell.classList.add('hint-revealed')
//     console.log('reveal clicked cell:', gGame.shownCount)
//     gRevealedCount++

//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue
//             const currCell = gBoard[i][j]
//             const elNeighborCell = document.querySelector(`.cell-${i}-${j}`)
//             if (!currCell.isShown) {
//                 gRevealedCount++
//                 console.log(`gRevealedCount ${1}:`, gRevealedCount)
//                 elNeighborCell.classList.add('hint-revealed')
//                 console.log(`reveal ${i}-${j}`, gGame.shownCount)
//             }
//         }
//     }
// }

// function hideRevealedCells(rowIdx, colIdx) {
//     const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
//     elCell.classList.remove('hint-revealed', 'marked-mine', 'marked-not-mine')
//     elCell.innerHTML = ''
//     gGame.shownCount--
//     console.log('hide clicked cell:', gGame.shownCount)
    
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue
//             const currCell = gBoard[i][j]
//             const elNeighborCell = document.querySelector(`.cell-${i}-${j}`)
//             if (!currCell.isShown || elNeighborCell.classList.contains('hint-revealed')) {
//                 elNeighborCell.classList.remove('hint-revealed', 'marked-mine', 'marked-not-mine')
//                 elNeighborCell.innerHTML = ''
//                 console.log(`hide ${i}-${j}`, gGame.shownCount)
//             }
//         }
//     }
//     gBoard[rowIdx][colIdx].isShown = false
//     // gGame.shownCount -= gRevealedCount
//     console.log('final gGame.shownCount', gGame.shownCount)
// }

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