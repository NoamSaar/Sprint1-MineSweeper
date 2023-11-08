'use strict'


var gBoard = []

const MINE = '💣'

function onInit() {
    gBoard = buildBoard(4, 4)
    console.log('gBoard:', gBoard)
    renderBoard(gBoard)

    setMinesNegsCount(gBoard)
}

// create board 
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

    // setting mines in known places
    board[1][1].isMine = true
    board[3][3].isMine = true

    // render board with the mines inside in rendom locations
    // for (var i = 0; i < 2; i++) {
    //     const i = getRandomInt(0, 4)
    //     const j = getRandomInt(0, 4)

    //     if (board[i][j].isMine) continue

    //     board[i][j].isMine = true
    // }

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

			if (currCell.isMine) cellClass += ' mine'

            const title = `cell: ${i}, ${j}`

			strHTML += `\t<td class="cell ${cellClass}" title="${title}" onclick="onCellClicked(this, ${i},${j})">`

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

                // render DOM
                // renderNegCount(i, j)
            }
        }
    }
    // console.log('board:', board)
}

// render neg count and update DOM
function renderNegCount(i, j) {
	const elCell = document.querySelector(`.cell-${i}-${j}`)
    const negMinesCount = gBoard[i][j].minesAroundCount
    if (negMinesCount === 0) return
	elCell.innerHTML = negMinesCount
}

// cell click event
function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]

    if (currCell.isMarked) return
    if (currCell.isShown) return

    if (currCell.isMine) {
        currCell.isShown = true                     //  Model
        elCell.classList.add('marked-mine')         // DOM
        elCell.innerHTML = MINE                     // DOM
        // console.log('gBoard:', gBoard)
    } else {
        currCell.isShown = true                     // Model
        elCell.classList.add('marked-not-mine')     // DOM
        renderNegCount(i, j)                        // DOM
        // console.log('gBoard:', gBoard)
    }
}

// neightbors loop 
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

// Returns the class name for a specific cell
function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}
