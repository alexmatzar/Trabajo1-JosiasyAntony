const grid = document.getElementById('grid');
const rickScoreDisplay = document.getElementById('rickScore');
const mortyScoreDisplay = document.getElementById('mortyScore');
const resultContainer = document.getElementById('resultContainer');
const resultMessage = document.getElementById('resultMessage');
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');

let rickScore = 0;
let mortyScore = 0;
let currentPlayer = 'Rick';
let gridSize = 3;
let gameActive = true;
let board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

// Crear el tablero
function createBoard() {
    grid.innerHTML = ''; // Limpiar el tablero
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            grid.appendChild(cell);
        }
    }
}

// Manejar el clic en la celda
function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] || !gameActive) return; // Ignorar si la celda ya tiene un valor o el juego no está activo

    board[row][col] = currentPlayer === 'Rick' ? 'X' : 'O';
    event.target.textContent = board[row][col];

    if (checkWin()) {
        gameActive = false;
        if (currentPlayer === 'Rick') {
            rickScore++;
            rickScoreDisplay.textContent = rickScore;
            resultMessage.textContent = '¡Rick gana!';
        } else {
            mortyScore++;
            mortyScoreDisplay.textContent = mortyScore;
            resultMessage.textContent = '¡Morty gana!';
        }
        resultContainer.style.display = 'block';
    } else if (board.flat().every(cell => cell)) {
        resultMessage.textContent = '¡Es un empate!';
        resultContainer.style.display = 'block';
    } else {
        currentPlayer = currentPlayer === 'Rick' ? 'Morty' : 'Rick'; // Cambiar jugador
    }
}

// Verificar si hay un ganador
function checkWin() {
    // Verificar filas, columnas y diagonales
    for (let i = 0; i < gridSize; i++) {
        if (board[i].every(cell => cell === (currentPlayer === 'Rick' ? 'X' : 'O'))) return true;
        if (board.map(row => row[i]).every(cell => cell === (currentPlayer === 'Rick' ? 'X' : 'O'))) return true;
    }
    if (board[0][0] === (currentPlayer === 'Rick' ? 'X' : 'O') && board[1][1] === (currentPlayer === 'Rick' ? 'X' : 'O') && board[2][2] === (currentPlayer === 'Rick' ? 'X' : 'O')) return true;
    if (board[0][2] === (currentPlayer === 'Rick' ? 'X' : 'O') && board[1][1] === (currentPlayer === 'Rick' ? 'X' : 'O') && board[2][0] === (currentPlayer === 'Rick' ? 'X' : 'O')) return true;
    return false;
}

// Botón de inicio
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startContainer').style.display = 'none';
    document.getElementById('introContainer').style.display = 'flex';

    // Iniciar el juego después de un tiempo
    setTimeout(() => {
        startGame();
    }, 10000);
});

// Iniciar el juego
function startGame() {
    document.getElementById('introContainer').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    createBoard();
}

// Botón de reinicio
restartButton.addEventListener('click', () => {
    board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    gameActive = true;
    currentPlayer = 'Rick';
    resultContainer.style.display = 'none';
    createBoard();
});

// Botón de salir (sin funcionalidad)
exitButton.addEventListener('click', () => {
    window.location.href = '../subhtmls/contenedor.html';
});

// Crear estrellas de fondo (opcional)
var Stars = function(args) {
    if (args === undefined) args = {};
    var _scope = this;

    this.stars = [];
    this.vel = args.vel || 1;
    this.radius = args.radius || 1;
    this.alpha = 0.2;
    this.starsCounter = args.stars || 300;
    var center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    var canvas, context;
    this.init = function() {
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        context = canvas.getContext("2d");
        context.lineCap = "round";
        this.start();
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }

    this.start = function() {
        this.stars = [];
        for (var i = 0; i < this.starsCounter; i++) {
            setTimeout(function(){
                _scope.stars.push(new Star());
            }, i * 30);
        }
    }

    this.resize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        center.x = canvas.width / 2;
        center.y = canvas.height / 2;
    }

    this.animate = function() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
    this.render = function() {
        context.fillStyle = 'rgba(1, 4, 35, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "white";
        for (var i = 0; i < this.stars.length; i++) this.stars[i].update();
    }

    var Star = function() {
        this.x = center.x;
        this.y = center.y;
        this.init = function() {
            this.radius = Math.random() * _scope.radius;
            this.x = center.x;
            this.y = center.y;
            this.lineWidth = 0;
            this.vel = {
                x: Math.random() * 4 - 2,
                y: Math.random() * 4 - 2
            }
        }
        this.update = function() {
            this.vel.x *= 1.05;
            this.vel.y *= 1.05;
            this.lineWidth += 0.035;
            this.x0 = this.x;
            this.y0 = this.y;
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.draw();
            if (this.isDead()) this.init();
        }
        
        this.draw = function() {
            context.beginPath();
            context.lineWidth = this.lineWidth;
            context.moveTo(this.x0, this.y0);
            context.lineTo(this.x, this.y);
            context.stroke();
        }

        this.isDead = function() {
            return (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height);
        }

        this.init();
    }

    this.init();
    this.animate();
}

new Stars({
    stars: 400,
    radius: 100
});