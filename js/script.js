// ===== КОНСТАНТЫ =====

/**
 * Символ игрока X
 * @constant {string}
 */
const PLAYER_X = 'X'

/**
 * Символ игрока O
 * @constant {string}
 */
const PLAYER_O = 'O'

/**
 * Сообщения игры
 * @constant {Object}
 * @property {string} X_WIN - Сообщение о победе X
 * @property {string} O_WIN - Сообщение о победе O
 * @property {string} DRAW - Сообщение о ничье
 * @property {string} RESULT - Текст кнопки результата
 * @property {string} RESTART - Текст кнопки перезапуска
 * @property {string} TIC_TAC_TOE - Название игры
 */
const MESSAGES = {
    X_WIN: 'X Win!!!',
    O_WIN: 'O Win!!!',
    DRAW: 'Draw!!!',
    RESULT: 'Result',
    RESTART: 'Restart',
    TIC_TAC_TOE: 'Tic Tac Toe'
}

/**
 * Выигрышные комбинации для игры в крестики-нолики
 * @constant {Array<Array<number>>}
 */
const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
    [0, 4, 8], [2, 4, 6]             // диагонали
]

// ===== СОСТОЯНИЕ ИГРЫ =====

/** @type {string} Текущий игрок (X или O) */
let currentPlayer = PLAYER_X

/** @type {boolean} Активна ли игра */
let isGameActive = true

/**
 * Текущее состояние игрового поля
 * @type {Array<string>}
 */
let currentBoardState = ['', '', '', '', '', '', '', '', '']

// ===== DOM ЭЛЕМЕНТЫ =====

/** @type {NodeList} Все клетки игрового поля */
const cellElements = document.querySelectorAll('[data-js-cell]')

/** @type {HTMLElement} Кнопка отображения результата */
const resultButtonElement = document.querySelector('[data-js-result]')

/** @type {HTMLElement} Кнопка перезапуска игры */
const restartButtonElement = document.querySelector('[data-js-restart]')

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/**
 * Проверяет победу текущего игрока
 * @returns {boolean} true если текущий игрок выиграл, иначе false
 */
const checkWin = () => {
    return WIN_PATTERNS.some(pattern => {
        return pattern.every(index => currentBoardState[index] === currentPlayer)
    })
}

/**
 * Проверяет ничью (все клетки заполнены)
 * @returns {boolean} true если все клетки заполнены и нет победителя
 */
const checkDraw = () => {
    return currentBoardState.every(cell => cell !== '')
}

/**
 * Завершает игру с сообщением
 * @param {string} message - Сообщение для отображения
 */
function endGame(message) {
    isGameActive = false
    resultButtonElement.textContent = message
    restartButtonElement.textContent = MESSAGES.RESTART
    restartButtonElement.classList.remove('content__button--game_title')
    restartButtonElement.classList.add('content__button--restart')
}

/**
 * Сбрасывает игру в начальное состояние
 */
function resetGame() {
    if (restartButtonElement.textContent === MESSAGES.TIC_TAC_TOE) return

    isGameActive = true
    currentPlayer = PLAYER_X
    currentBoardState = ['', '', '', '', '', '', '', '', '']

    cellElements.forEach(cell => {
        cell.classList.remove('grid__cell--x', 'grid__cell--o', 'grid__cell--empty', 'preview-x', 'preview-o')
    })

    resultButtonElement.textContent = MESSAGES.RESULT
    restartButtonElement.textContent = MESSAGES.TIC_TAC_TOE
    restartButtonElement.classList.remove('content__button--restart')
    restartButtonElement.classList.add('content__button--game_title')
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

/**
 * Обрабатывает наведение курсора на клетку
 * @param {MouseEvent} event - Событие мыши
 */
function handleMouseEnter(event) {
    const cell = event.currentTarget
    const cellIndex = parseInt(cell.getAttribute('data-js-cell'))

    if (isGameActive && currentBoardState[cellIndex] === '') {
        currentPlayer === PLAYER_X
            ? cell.classList.add('preview-x')
            : cell.classList.add('preview-o')
    }
}

/**
 * Обрабатывает уход курсора с клетки
 * @param {MouseEvent} event - Событие мыши
 */
function handleMouseLeave(event) {
    const cell = event.currentTarget
    cell.classList.remove('preview-x', 'preview-o')
}

/**
 * Обрабатывает клик по клетке
 * @param {MouseEvent} event - Событие клика
 */
function handleCellClick(event) {
    const cell = event.currentTarget
    const cellIndex = parseInt(cell.getAttribute('data-js-cell'))

    cell.classList.remove('preview-x', 'preview-o')

    if (isGameActive && currentBoardState[cellIndex] === '') {
        currentBoardState[cellIndex] = currentPlayer
        cell.classList.add(`grid__cell--${currentPlayer.toLowerCase()}`)

        if (currentPlayer === PLAYER_X) {
            cellElements.forEach((cell, index) => {
                if (currentBoardState[index] === '') {
                    cell.classList.add('grid__cell--empty')
                }
            })
        } else {
            cellElements.forEach(cell => {
                cell.classList.remove('grid__cell--empty')
            })
        }

        if (checkWin()) {
            endGame(currentPlayer === PLAYER_X ? MESSAGES.X_WIN : MESSAGES.O_WIN)
        } else if (checkDraw()) {
            endGame(MESSAGES.DRAW)
        } else {
            currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====

/**
 * Инициализирует игровое поле, добавляя обработчики событий
 */
function initializeGame() {
    cellElements.forEach(cell => {
        cell.addEventListener('mouseenter', handleMouseEnter)
        cell.addEventListener('mouseleave', handleMouseLeave)
        cell.addEventListener('click', handleCellClick)
    })

    restartButtonElement.addEventListener('click', resetGame)
}

// Запуск игры
initializeGame()