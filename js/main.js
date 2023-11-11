'use strict'

const MINE = '💣'
const MARK = '🚩'
const WIN_S = '😎'
const MINE_S = '🤯'
const LOOSE_S = '☠️'
const NORNAL_S = '😄'
const LIFE = '♥'
const LOST_LIFE = '💔'

// const STORAGE_KEY = 'minesweeper_best_score'

var timerInterval

var gBoard = []
var gGameMoves = []

const gGame = {
    isOn: false,
    isFirstClick: true,
    isVictory: true,

    isDarkMode: false,
    isManualMode: false,
    isMegaHint: false,
    
    manualMinesPlaced: false,

    timerInterval, 
    shownCellsCount: 0,
    markedCellsCount: 0,
    minesStricks: 0,
    secsPassed: 0,
    score: 0,
    manualMinesCount: 0,
}

const gBonus = {
    useHint: false,
    useMegaHint: false,
    useSafe: false,
    useMine: false,

    megaCoor1: null,
    megaCoor2: null,
    megaCoorCount: 0,

    totalHintsCount: 3,
    hintsNum: 0,
    totalSafeCount: 3,
    terminatedMinesCount: 0,
}

const gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 3,
}

function onInit() {
    modalDisplay('add')
    changeLivesCount(gLevel.LIVES)
    changeSmiley(NORNAL_S)
    generateHints(gBonus.totalHintsCount)
    clearhints()
    updateBestScore()
    toggleAllBtns(true)
    ResetAfterGameOver()
    handleDarkMode()
    handleTimer()
    updateScore(gGame.score)

    // build and render empty board
    gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE)               // Model
    renderBoard(gBoard)                                         // DOM
    setMinesNegsCount(gBoard)
    gGameMoves.push(copyBoard(gBoard))
}

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
    return board
}

function renderBoard(board) {
    var strHTML = ''
    const elBoard = document.querySelector('.board')

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            // if (currCell.isMine) cellClass += ' mine'

            const title = `cell: ${i}, ${j}`

            strHTML += `\t<td class="cell ${cellClass}" title="${title}" 
            data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onMarkCell(this, ${i}, ${j})">`

            // if (currCell.isMine) strHTML += MINE

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:', strHTML)
    elBoard.innerHTML = strHTML
}

function handleFirstClick(i, j) {
    placeMines(gBoard, gLevel.MINES, i, j)
    setMinesNegsCount(gBoard)
    renderAfterMines(gBoard)
    gGameMoves.push(copyBoard(gBoard))
    console.log('gGameMoves:', gGameMoves)
}

function onCellClicked(elCell, i, j) {

    const currCell = gBoard[i][j]

    if (!gGame.isOn || currCell.isMarked || currCell.isShown) return

    if (gBonus.useHint) {
        handleUseHint(i, j)
        return
    }

    if (gBonus.useMegaHint) {
        handleUseMegaHint(i, j)
        return
    }

    if (gGame.isManualMode) {
        handleManualMode(i, j)
        return
    }

    if (gGame.isFirstClick && !gGame.manualMinesPlaced) {
        handleFirstMove(i, j)
    }

    if (currCell.isMine) {
        handleMineClicked(elCell, currCell)
    } else {
        handleNonMineClicked(elCell, currCell, i, j)
    }
}

function handleUseHint(i, j) {
    gBonus.useHint = false
    useHints(i, j)

    gGame.score -= 10
    if (gGame.score < 0) gGame.score = 0
    updateScore(gGame.score)
}

function handleUseMegaHint(i, j) {
    if (gBonus.megaCoorCount) {
        if (gBonus.megaCoorCount === 1) {
            gBonus.megaCoor2 = { i, j }
            gGame.score -= 10
            useMegaHint()
            gBonus.useMegaHint = false
            gBonus.megaCoorCount = 0
        } else {
            gBonus.megaCoor1 = [i, j]
        }
    } else {
        gBonus.megaCoorCount = 1
        gBonus.megaCoor1 = { i, j }

        const currCell = gBoard[gBonus.megaCoor1.i][gBonus.megaCoor1.j]
        const elCell1 = document.querySelector(`.cell-${gBonus.megaCoor1.i}-${gBonus.megaCoor1.j}`)
        elCell1.classList.add('manual-mark')
    }

    if (gGame.score < 0) gGame.score = 0
    updateScore(gGame.score)
}

function handleManualMode(i, j) {
    if (gGame.manualMinesCount > 0) {
        placeMinesManualy(gBoard, i, j)
        setTimeout(() => {
            hideMinesManualy(i, j)
        }, 1000)
        gGameMoves.push(copyBoard(gBoard))
        console.log('gBoard:', gBoard)
    }

    if (gGame.manualMinesCount === 0) {
        setTimeout(() => {
            removeAllMarkedManualMines()
            toggleAllBtns(false)
        }, 2000)
        toggleManualMode()
        setMinesNegsCount(gBoard)
        gGame.manualMinesPlaced = true
    }
}

function handleFirstMove(i, j) {
    toggleDisabledBtn('manual-mode-btn', true)
    gGame.isFirstClick = false

    toggleAllBtns(false)

    handleFirstClick(i, j)
    startTimer()
}

function handleMineClicked(elCell, currCell) {
    changeSmiley(MINE_S)

    gGame.score -= 10
    if (gGame.score < 0) gGame.score = 0

    updateScore(gGame.score)
    if (gGame.minesStricks < gLevel.LIVES) {
        gGame.minesStricks++
        gGame.shownCellsCount++
    }

    currCell.isShown = true                     // Model
    gGame.isVictory = false                     // Model

    elCell.classList.add('marked-mine')         // DOM
    elCell.innerHTML = MINE                     // DOM

    gClickedMinesCount--
    changeLivesCount(gClickedMinesCount)

    if (gClickedMinesCount === 0) {
        changeLivesCount('-')
        displayAllMines(gBoard)
        gameOver()
    }

    if (gGame.shownCellsCount === gLevel.SIZE ** 2) {
        gameOver()
    }
}

function handleNonMineClicked(elCell, currCell, i, j) {
    changeSmiley(NORNAL_S)

    if (IsclearFromNegMines(gBoard, i, j)) {
        gGame.score += 10
        updateScore(gGame.score)

        expandShown(gBoard, elCell, i, j)
    } else {
        gGame.score++
        updateScore(gGame.score)

        currCell.isShown = true                     // Model
        gGame.shownCellsCount++                          // Model

        elCell.classList.add('marked-not-mine')     // DOM
        renderNegCount(i, j)                        // DOM
    }

    if (checkGameOver()) {
        gameOver()
    }
}

function handleTimer() {
    if (gGame.timerInterval) stopTimer()
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = '00:00'
}

function handleDarkMode() {
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode !== null) {
        if (storedDarkMode === 'true') {
            displayDarkMode()
        }
    }
}

function expandShown(board, elCell, rowIdx, colIdx) {
    if (!isValidCell(rowIdx, colIdx) ||
        board[rowIdx][colIdx].isShown ||
        board[rowIdx][colIdx].isMarked) return

    const currCell = board[rowIdx][colIdx]
    elCell.classList.add('marked-not-mine')
    gGame.shownCellsCount++
    currCell.isShown = true

    if (currCell.minesAroundCount === 0) {
        for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
            for (let j = colIdx - 1; j <= colIdx + 1; j++) {
                expandShown(board, getCellElement(i, j), i, j);
            }
        }
    }

    renderNegCount(rowIdx, colIdx)
}

function onMarkCell(elCell, i, j) {
    const currCell = gBoard[i][j]


    if (!currCell.isShown) {
        // Toggle isMarked property
        currCell.isMarked = !currCell.isMarked      // Model

        if (currCell.isMarked) {
            gGame.score += 10
            updateScore(gGame.score)

            gGame.markedCellsCount++                     // Model
            elCell.innerHTML = MARK                 // DOM

        } else {
            gGame.score -= 10
            updateScore(gGame.score)

            gGame.markedCellsCount--                    // Model
            elCell.innerHTML = ''                   // DOM 
        }

        if (checkGameOver()) {
            gameOver()
        }
    }
}

function undoLastMove() {
    console.log('undo clicked')
    console.log('gGameMoves:', gGameMoves)
    if (!gGame.isOn) return

    if (gGameMoves.length > 0) {
        gBoard = copyBoard(gGameMoves.pop())
        console.log('gBoard:', gBoard)
        renderAfterMines(gBoard)
    }
}

function checkGameOver() {
    const allMinesMarked = gGame.markedCellsCount + gGame.minesStricks === gLevel.MINES - gBonus.terminatedMinesCount
    const allNonMinesShown = gGame.shownCellsCount === gLevel.SIZE ** 2 - gGame.markedCellsCount

    if (allMinesMarked && allNonMinesShown) {
        gGame.isVictory = true
        return true
    }

    if (gGame.shownCellsCount === gLevel.SIZE ** 2) {
        gGame.isVictory = false
        return true
    }

    return false
}

function gameOver() {
    gGame.isOn = false
    stopTimer()
    modalDisplay('remove')

    saveBestScore(gGame.score)
    updateBestScore()
    gGame.manualMinesPlaced = false
}

function ResetAfterGameOver() {
    toggleDisabledBtn('manual-mode-btn', false)

    gGameMoves = []

    gGame.isOn = true
    gGame.isFirstClick = true
    gGame.manualMinesPlaced = false

    gGame.score = 0
    gGame.markedCellsCount = 0
    gGame.shownCellsCount = 0
    gGame.secsPassed = 0
    gGame.minesStricks = 0

    gBonus.totalHintsCount = 3
    gBonus.hintsNum = 0
    gBonus.totalSafeCount = 3
    gBonus.megaCoorCount = 0
    gBonus.terminatedMinesCount = 0

    gGame.manualMinesCount = gLevel.MINES
    gClickedMinesCount = gLevel.LIVES
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
    gGame.timerInterval = setInterval(updateTimer, 1000)
    updateTimer()
}

function updateTimer() {
    const minutes = Math.floor(gGame.secsPassed / 60)
    const seconds = gGame.secsPassed % 60

    const formattedTime = padNumber(minutes, 2) + ':' + padNumber(seconds, 2)

    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = formattedTime

    gGame.secsPassed++
}

function stopTimer() {
    clearInterval(gGame.timerInterval)
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

function isValidCell(rowIdx, colIdx) {
    return rowIdx >= 0 &&
        rowIdx < gLevel.SIZE &&
        colIdx >= 0 &&
        colIdx < gLevel.SIZE
}