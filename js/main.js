'use strict'

const MINE = '💣'
const MARK = '🚩'
const WIN_S = '😎'
const MINE_S = '🤯'
const LOOSE_S = '🫠'
const NORNAL_S = '😄'
// const RIGHT_S = '🥳'

var timerInterval

var gBoard = []

const gGame = {
    isOn: false,
    isFirstClick: true,
    isVictory: true,
    shownCount: 0,
    markedCount: 0,
    minesStricks: 0,
    secsPassed: 0,
}

const gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 2,
}

var gClickedMinesCount = gLevel.LIVES

function onInit() {
    modalDisplay('add')
    changeLivesCount(gLevel.LIVES)
    changeSmiley(NORNAL_S)

    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = '000'
    
    gGame.isOn = true
    gGame.isFirstClick = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.minesStricks = 0
    
    gClickedMinesCount = gLevel.LIVES
    
    gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE)               // Model

    renderBoard(gBoard)                                         // DOM
    // console.log('gBoard:', gBoard)                           

    setMinesNegsCount(gBoard)

    startTimer()
}

/*
// function addFirstClickEventListener() {
//     const elBoard = document.querySelector('.board')
//     elBoard.addEventListener('click', onFirstClick, { once: true })
// }
// function onFirstClick(event) {


//     event.currentTarget.removeEventListener('click', onFirstClick)
// }


// function onFirstClick(elCell, i, j) {
//     if (!gGame.isFirstClick) return

//     gGame.isFirstClick = false
//     gBoard[i][j].isShown = true
//     elCell.innerText = gBoard[i][j].isMine? MINE_S : MARK

//     // render board with the mines inside in rendom locations
//     for (var i = 0; i < gLevel.MINES; i++) {
//         const i = getRandomInt(0, 4)
//         const j = getRandomInt(0, 4)

//         if (gBoard[i][j].isMine || gBoard[i][j].isShown) continue

//         gBoard[i][j].isShown = true                 // Model
//         gGame.shownCount++                          // Model

//         elCell.classList.add('marked-not-mine')     // DOM
//         renderNegCount(i, j)                        // DOM
//     }

// }
*/

// create boards
function buildBoard(rows, cols) {
    const board = []
    for (var i = 0; i < rows; i++) {
        board[i] = []
        for (var j = 0; j < cols; j++) {
            const cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }
    }

    // // setting mines in known places
    // board[1][1].isMine = true
    // board[3][3].isMine = true
    
    // render board with the mines inside in rendom locations
    placeMines(board, gLevel.MINES)

    return board
}

function placeMines(board, mines) {
    for (var m = 0; m < mines; m++) {
        const i = getRandomInt(0, board.length)
        const j = getRandomInt(0, board[0].length)

        if (board[i][j].isMine || board[i][j].isShown) continue

        board[i][j].isMine = true
    }
}

// render board with the mines inside
function renderBoard(board) {
    var strHTML = ''
    const elBoard = document.querySelector('.board')

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            if (currCell.isMine) cellClass += ' mine'

            const title = `cell: ${i}, ${j}`

            strHTML += `\t<td class="cell ${cellClass}" title="${title}" 
            data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(this, ${i}, ${j})">`
            // onclick="onFirstClick()(this, ${i}, ${j})"
            
            // if (currCell.isMine) strHTML += MINE

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:', strHTML)
    elBoard.innerHTML = strHTML
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

// cell click event
function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    
    if (!gGame.isOn) return
    if (currCell.isMarked) return
    if (currCell.isShown) return

    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        startTimer()
    }

    if (currCell.isMine) {
        changeSmiley(MINE_S)
        if (gGame.minesStricks < gLevel.LIVES) {
            gGame.minesStricks++
            gGame.shownCount++
        }

        currCell.isShown = true                     // Model
        gGame.isVictory = false                     // Model

        elCell.classList.add('marked-mine')         // DOM
        elCell.innerHTML = MINE                     // DOM

        gClickedMinesCount--
        const elMinsCount = document.querySelector('.mines-count')
        elMinsCount.innerHTML = gClickedMinesCount

        if (gClickedMinesCount === 0) {
            changeLivesCount('-')
            displayAllMines(gBoard)
            gameOver()
        }

    } else {
        changeSmiley(NORNAL_S)
        if (clearFromNegMines(gBoard, i, j)) {
            expandShown(gBoard, elCell, i, j)

        } else {
            currCell.isShown = true                     // Model
            gGame.shownCount++                          // Model

            elCell.classList.add('marked-not-mine')     // DOM
            renderNegCount(i, j)                        // DOM
        }

        if (checkGameOver()) {
            gameOver()
        }
    }
}

function expandShown(board, elCell, rowIdx, colIdx) {
    gGame.shownCount++                                      // Model
    elCell.classList.add('marked-not-mine')                 // DOM

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 && j >= board[i].length) continue
            var currCell = board[i][j]
            const elNegCell = document.querySelector(`.cell-${i}-${j}`)

            if (currCell && !currCell.isShown) {
                currCell.isShown = true                     // Model
                gGame.shownCount++                          // Model

                elNegCell.classList.add('marked-not-mine')  // DOM
                renderNegCount(i, j)                        // DOM
            }
        }
    }
    // console.log(gGame)
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

// mark cell with FLAG if thinks it is a mine
function onCellMarked(elCell, i, j) {
    const currCell = gBoard[i][j]
    

    if (!currCell.isShown) {
        // Toggle isMarked property
        currCell.isMarked = !currCell.isMarked      // Model
        // console.log('gBoard:', gBoard)

        if (currCell.isMarked) {
            gGame.markedCount++                     // Model
            elCell.innerHTML = MARK                 // DOM

        } else {
            gGame.markedCount--                    // Model
            elCell.innerHTML = ''                   // DOM 
        }

        if (checkGameOver()) {
            gameOver()
        }
    }
}

function checkGameOver() {
    const allMinesMarked = gGame.markedCount + gGame.minesStricks === gLevel.MINES
    const allNonMinesShown = gGame.shownCount === gLevel.SIZE ** 2 - gGame.markedCount
    // console.log('allMinesMarked:', allMinesMarked)
    // console.log('allNonMinesShown:', allNonMinesShown)

    if (allMinesMarked && allNonMinesShown) {
        gGame.isVictory = true
        return true
    }

    return false
}

function gameOver() {
    gGame.isOn = false
    stopTimer()
    modalDisplay('remove')
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


function countNeighborAround(board, rowIdx, colIdx) {
    var neighborsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue            // don't want to check out of the board
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue      // don't want to eat yourself
            if (j < 0 && j >= board[i].length) continue     // don't want to check out of the board
            var currCell = board[i][j]
            if (currCell && currCell.isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function startTimer() {
    if (gGame.isFirstClick) return
    timerInterval = setInterval(updateTimer, 1000)
    updateTimer()
}

function updateTimer() {
    const formattedTime = padNumber(gGame.secsPassed, 3)
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = formattedTime
    gGame.secsPassed++
}

function stopTimer() {
    clearInterval(timerInterval)
}

function padNumber(number, width) {
    const numberString = number.toString()
    const padding = '0'.repeat(Math.max(0, width - numberString.length))
    return padding + numberString
}

function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

function modalDisplay(action) {
    const elModal = document.querySelector('.modal')
    const h2 = elModal.querySelector('h2')

    if (gGame.isVictory) {
        h2.innerHTML = 'You Won! 👻'
        changeSmiley(WIN_S)
    } else {
        h2.innerHTML = 'You Lost 🙁'
        changeSmiley(LOOSE_S)
    }

    if (action === 'add') {
        elModal.classList.add('hidden')
    } else (
        elModal.classList.remove('hidden')
    )
}

function changeLivesCount(count) {
    const elMinsCount = document.querySelector('.mines-count')
    elMinsCount.innerHTML = count
}

function changeSmiley(EMOJI) {
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = EMOJI
}

function changeLevel(level, mines) {
    gLevel.SIZE = level
    gLevel.MINES = mines
    onInit()
}