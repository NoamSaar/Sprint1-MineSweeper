'use strict'

// // Prevent the context menu from appearing
window.addEventListener('contextmenu', function (e) {
    e.preventDefault() 
})

// getRamdomInt
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}