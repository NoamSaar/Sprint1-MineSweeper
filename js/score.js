'use strict'

const STORAGE_KEY = 'minesweeper_best_score'

function updateScore(score) {
    const elScore = document.querySelector('.score')
    elScore.innerHTML = score
}

function saveBestScore(score) {
    const bestScore = localStorage.getItem(STORAGE_KEY)
    if (bestScore === null || score > bestScore) {
        localStorage.setItem(STORAGE_KEY, score)
    }
}

function getBestScore() {
    return localStorage.getItem(STORAGE_KEY) || 'N/A'
}

function updateBestScore() {
    const elBestScoreSpan = document.querySelector('.best-score')
    elBestScoreSpan.innerHTML = getBestScore()
}