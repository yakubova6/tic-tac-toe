// ===== СОСТОЯНИЕ ИГРЫ =====
let currentPlayer = 'X'
let isGameActive = true
let currentBoardState = [
    '', '', '',
    '', '', '',
    '', '', ''
]

// ===== DOM ЭЛЕМЕНТЫ =====
const cellElements = document.querySelectorAll('[data-js-cell]')
const resultButtonElement = document.querySelector('[data-js-result]')
const restartButtonElement = document.querySelector('[data-js-restart]')

// ===== КОНСТАНТЫ =====
const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
    [0, 4, 8], [2, 4, 6]             // диагонали
]

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/** Проверяет победу текущего игрока */
const checkWin = () => {
    return WIN_PATTERNS.some(pattern => {
        return pattern.every(index => currentBoardState[index] === currentPlayer)
    })
}

/** Проверяет ничью (все клетки заполнены) */
const checkDraw = () => {
    return currentBoardState.every(cell => cell !== '')
}

/** Завершает игру с сообщением */
function endGame(message) {
    isGameActive = false
    resultButtonElement.textContent = message
    restartButtonElement.textContent = 'Restart'
    restartButtonElement.classList.remove('button--game-title')
    restartButtonElement.classList.add('button--restart')
}

/** Сбрасывает игру в начальное состояние */
function resetGame() {
    if (restartButtonElement.textContent === 'Tic Tac Toe') return

    isGameActive = true
    currentPlayer = 'X'
    currentBoardState = ['', '', '', '', '', '', '', '', '']

    cellElements.forEach(cell => {
        cell.classList.remove('grid__cell--x', 'grid__cell--o', 'preview-x', 'preview-o')
    })

    resultButtonElement.textContent = 'Result'
    restartButtonElement.textContent = 'Tic Tac Toe'
    restartButtonElement.classList.remove('button--restart')
    restartButtonElement.classList.add('button--game-title')
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

/** Обрабатывает наведение на клетку */
function handleMouseEnter(event) {
    const cell = event.currentTarget
    const cellIndex = parseInt(cell.getAttribute('data-js-cell'))

    if (isGameActive && currentBoardState[cellIndex] === '') {
        currentPlayer === 'X'
            ? cell.classList.add('preview-x')
            : cell.classList.add('preview-o')
    }
}

/** Обрабатывает уход курсора с клетки */
function handleMouseLeave(event) {
    const cell = event.currentTarget
    cell.classList.remove('preview-x', 'preview-o')
}

/** Обрабатывает клик по клетке */
function handleCellClick(event) {
    const cell = event.currentTarget
    const cellIndex = parseInt(cell.getAttribute('data-js-cell'))

    cell.classList.remove('preview-x', 'preview-o')

    if (isGameActive && currentBoardState[cellIndex] === '') {
        currentBoardState[cellIndex] = currentPlayer
        cell.classList.add(`grid__cell--${currentPlayer.toLowerCase()}`)

        if (checkWin()) {
            endGame(`${currentPlayer} Win!!!`)
        } else if (checkDraw()) {
            endGame('Draw!!!')
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
cellElements.forEach(cell => {
    cell.addEventListener('mouseenter', handleMouseEnter)
    cell.addEventListener('mouseleave', handleMouseLeave)
    cell.addEventListener('click', handleCellClick)
})

restartButtonElement.addEventListener('click', resetGame)