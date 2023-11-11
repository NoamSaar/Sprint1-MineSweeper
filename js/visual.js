'use strict'

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
    const elSmiley = document.querySelector('.smiley-btn')
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

function toggleAllBtns(boolean) {
    toggleBtn('mega-hint', 'no-left', 'remove', boolean)
    toggleBtn('safe-btn', 'no-left', 'remove', boolean)
    toggleBtn('mine-ex-btn', 'no-left', 'remove', boolean)
    toggleDisabledBtn('hint', boolean)
    toggleDisabledBtn('smiley-btn', boolean)
    toggleDisabledBtn('undo-btn', boolean)
}

function toggleBtn(btnClassName, designClass, action, isShown) {
    const elBtn = document.querySelector(`.${btnClassName}`)
    if (action === 'add') {
        elBtn.classList.add(designClass)
    } else {
        elBtn.classList.remove(designClass)
    }
    elBtn.disabled = isShown
}

function toggleDisabledBtn(btnClassName, isShown) {
    if (btnClassName === 'hint') {
        for (var i = 0; i < gBonus.totalHintsCount; i++) {
            const elHintsBtn = document.querySelector(`.hint${i + 1}`)
            elHintsBtn.disabled = isShown
        }
    } else {
        const elBtn = document.querySelector(`.${btnClassName}`)
        elBtn.disabled = isShown
    }
}