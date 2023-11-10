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
    manualMinesPlaced: false,
    isMegaHint: false,

    shownCount: 0,
    markedCount: 0,
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
    hintsCount: 3,
    hintsNum: 0,
    getMegaCount: 0,
    safeCount: 3,
    safeNum: 0,
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
    generateHints(gBonus.hintsCount)
    clearhints()
    updateBestScore()

    toggleDisabledBtn('mega-hint', 'no-left', 'remove', true)
    toggleDisabledBtn('safe-btn', 'no-left', 'remove', true)
    toggleDisabledBtn('mine-ex-btn', 'no-left', 'remove', true)

    gGameMoves = []
    // gGameMoves.push(copyGameBoard(gBoard))

    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode !== null) {
        if (storedDarkMode === 'true') {
            displayDarkMode()
        }
    }

    if (timerInterval) stopTimer()
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = '00:00'

    gGame.score = 0
    updateScore(gGame.score)

    gGame.isOn = true
    gGame.isFirstClick = true
    gGame.manualMinesPlaced = false

    gBonus.getMegaCount = 0
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.minesStricks = 0

    gBonus.hintsCount = 3
    gBonus.hintsNum = 0
    gBonus.safeCount = 3
    gBonus.terminatedMinesCount = 0

    gGame.manualMinesCount = gLevel.MINES
    gClickedMinesCount = gLevel.LIVES

    // build and render empty board
    gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE)               // Model
    renderBoard(gBoard)                                         // DOM

    setMinesNegsCount(gBoard)
}

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
    return board
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

            // if (currCell.isMine) cellClass += ' mine'

            const title = `cell: ${i}, ${j}`

            strHTML += `\t<td class="cell ${cellClass}" title="${title}" 
            data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(this, ${i}, ${j})">`

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
}

// cell click event
function onCellClicked(elCell, i, j) {

    const currCell = gBoard[i][j]

    if (!gGame.isOn || currCell.isMarked || currCell.isShown) return

    if (gBonus.useHint) {
        gBonus.useHint = false
        useHints(i, j)

        gGame.score -= 10
        if (gGame.score < 0) gGame.score = 0
        updateScore(gGame.score)
        return
    }

    if (gBonus.useMegaHint) {
        if (gBonus.getMegaCount) {
            if (gBonus.getMegaCount === 1) {
                gBonus.megaCoor2 = { i, j }
                gGame.score -= 10
                useMegaHint()
                gBonus.useMegaHint = false
                gBonus.getMegaCount = 0
            } else {
                gBonus.megaCoor1 = [i, j]
            }
        } else {
            gBonus.getMegaCount = 1
            gBonus.megaCoor1 = { i, j }

            const currCell = gBoard[gBonus.megaCoor1.i][gBonus.megaCoor1.j]
            const elCell1 = document.querySelector(`.cell-${gBonus.megaCoor1.i}-${gBonus.megaCoor1.j}`)
            elCell1.classList.add('manual-mark')

        }

        if (gGame.score < 0) gGame.score = 0
        updateScore(gGame.score)
        return
    }
    // gGameMoves.push(copyBoard(gBoard))

    if (gGame.isManualMode) {
        if (gGame.manualMinesCount > 0) {
            placeMinesManualy(gBoard, i, j)
            setTimeout(() => {
                hideMinesManualy(i, j)
            }, 1000)
        }

        if (gGame.manualMinesCount === 0) {
            setTimeout(() => {
                removeAllMarkedManualMines()
            }, 2000)
            toggleManualMode()
            setMinesNegsCount(gBoard)
            gGame.manualMinesPlaced = true
        }
        return
    }


    if (gGame.isFirstClick && !gGame.manualMinesPlaced) {
        // console.log('gGame.isManualMode:', gGame.isManualMode)
        gGame.isFirstClick = false

        toggleDisabledBtn('mega-hint', 'no-left', 'remove', false)
        toggleDisabledBtn('safe-btn', 'no-left', 'remove', false)
        toggleDisabledBtn('mine-ex-btn', 'no-left', 'remove', false)
    
        handleFirstClick(i, j)
        startTimer()
    }

    if (currCell.isMine) {
        changeSmiley(MINE_S)

        gGame.score -= 10
        if (gGame.score < 0) gGame.score = 0

        updateScore(gGame.score)
        if (gGame.minesStricks < gLevel.LIVES) {
            gGame.minesStricks++
            gGame.shownCount++
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

        if (gGame.shownCount === gLevel.SIZE ** 2) {
            gameOver()
        }

    } else {
        changeSmiley(NORNAL_S)
        if (clearFromNegMines(gBoard, i, j)) {
            gGame.score += 10
            updateScore(gGame.score)

            expandShown(gBoard, elCell, i, j)
        } else {
            gGame.score++
            updateScore(gGame.score)

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

/*
function expandShown(board, elCell, rowIdx, colIdx) {
    gGame.shownCount++                                      // Model
    gBoard[rowIdx][colIdx].isShown = true                   // Model
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
*/

function expandShown(board, elCell, rowIdx, colIdx) {
    if (!isValidCell(rowIdx, colIdx) ||
        board[rowIdx][colIdx].isShown ||
        board[rowIdx][colIdx].isMarked) return

    const currCell = board[rowIdx][colIdx]
    elCell.classList.add('marked-not-mine')
    gGame.shownCount++
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

// mark cell with FLAG if thinks it is a mine
function onCellMarked(elCell, i, j) {
    const currCell = gBoard[i][j]


    if (!currCell.isShown) {
        // Toggle isMarked property
        currCell.isMarked = !currCell.isMarked      // Model

        if (currCell.isMarked) {
            gGame.score += 10
            updateScore(gGame.score)

            gGame.markedCount++                     // Model
            elCell.innerHTML = MARK                 // DOM

        } else {
            gGame.score -= 10
            updateScore(gGame.score)

            gGame.markedCount--                    // Model
            elCell.innerHTML = ''                   // DOM 
        }

        if (checkGameOver()) {
            gameOver()
        }
    }
}

function undoLastMove() {
    console.log('hi')
    console.log('gBoard before pop:', gBoard)
    if (gGameMoves.length > 0) {
        var prevState = gGameMoves.pop()
        console.log('prevState:', prevState)

        gBoard = prevState
        console.log('gBoard after pop:', gBoard)

        renderAfterMines(gBoard)
    }
}

function checkGameOver() {
    const allMinesMarked = gGame.markedCount + gGame.minesStricks === gLevel.MINES - gBonus.terminatedMinesCount
    const allNonMinesShown = gGame.shownCount === gLevel.SIZE ** 2 - gGame.markedCount

    if (allMinesMarked && allNonMinesShown) {
        gGame.isVictory = true
        return true
    }

    if (gGame.shownCount === gLevel.SIZE ** 2) {
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
    const minutes = Math.floor(gGame.secsPassed / 60)
    const seconds = gGame.secsPassed % 60

    const formattedTime = padNumber(minutes, 2) + ':' + padNumber(seconds, 2)

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

function isValidCell(rowIdx, colIdx) {
    return rowIdx >= 0 &&
        rowIdx < gLevel.SIZE &&
        colIdx >= 0 &&
        colIdx < gLevel.SIZE
}

function getCellElement(rowIdx, colIdx) {
    return document.querySelector(`.cell-${rowIdx}-${colIdx}`)
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
    const elLivesCount = document.querySelector('.lives-count')

    const lifeEmoji = count > 0 ? LIFE : LOST_LIFE
    elLivesCount.innerHTML = lifeEmoji.repeat(Math.max(0, count)).split('').join('&nbsp;')
}

function changeSmiley(EMOJI) {
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = EMOJI
}

function changeLevel(level, mines) {
    stopTimer()
    gLevel.SIZE = level
    gLevel.MINES = mines
    onInit()
}

function displayDarkMode() {
    const elDarkModeBtn = document.querySelector('.dark-mode-btn')
    const isDarkMode = document.body.classList.toggle('dark-mode')
    const elContainer = document.querySelector('.container');


    localStorage.setItem('darkMode', isDarkMode)

    elDarkModeBtn.innerHTML = isDarkMode ? 'Light Mode' : 'Dark Mode'
    elDarkModeBtn.classList.toggle('dark-mode')

    elContainer.classList.toggle('dark-mode-container', isDarkMode)

    const elTable = document.querySelector('.board')
    const tdList = elTable.querySelectorAll('td')



    tdList.forEach(td => {
        td.classList.toggle('dark-mode-table', isDarkMode)
    })
}

function toggleDisabledBtn(btnClassName, designClass, action, isShown) {
    const elBtn = document.querySelector(`.${btnClassName}`)
    if (action === 'add') {
        elBtn.classList.add(designClass)
    } else {
        elBtn.classList.remove(designClass)
    }
    elBtn.disabled = isShown
}