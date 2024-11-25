let score = 0;
let gameRunning = false;
let carSpeed = 20; // Kecepatan pergerakan mobil
let coinSpeed = 5;
let enemyCarSpeed = 3;
let enemyCars = []; // Array untuk menyimpan mobil musuh

const playButton = document.getElementById('playButton');
const homeButton = document.getElementById('homeButton');
const restartButton = document.getElementById('restartButton');
const homeScreen = document.getElementById('homeScreen');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const car = document.getElementById('car');
const coin = document.getElementById('coin');
const road = document.getElementById('road');

// Menambahkan roadline ke dalam road
const roadline = document.createElement('div');
roadline.classList.add('roadline');
road.appendChild(roadline);

// High score yang disimpan di localStorage
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
const highScoreDisplay = document.getElementById('highScore');

// Menampilkan High Score di halaman home
highScoreDisplay.textContent = 'High Score: ' + highScore;

// Posisi awal mobil dan objek lain
let carPositionX = window.innerWidth / 2 - 75; // Memindahkan mobil sedikit ke kiri
let coinPositionY = -100;
let coinPositionX = Math.random() * (window.innerWidth - 50);

// Mulai permainan
playButton.addEventListener('click', startGame);
homeButton.addEventListener('click', backToHome);
restartButton.addEventListener('click', startGame);

function startGame() {
    homeScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    gameOverScreen.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    gameRunning = true;
    car.style.left = carPositionX + 'px';

    // Pastikan mobil berada di atas jalan
    car.style.bottom = '120px';  // Posisi mobil sedikit lebih tinggi dari jalan

    coinPositionY = -100;
    coinPositionX = Math.random() * (window.innerWidth - 50);

    // Reset array mobil musuh dan tambahkan mobil musuh baru
    enemyCars.forEach(car => gameContainer.removeChild(car.element)); // Hapus mobil musuh lama
    enemyCars = [];
    for (let i = 0; i < 5; i++) { // Menambah 5 mobil musuh
        const enemyCar = document.createElement('div');
        enemyCar.classList.add('enemyCar');

        // Tambahkan kelas acak untuk gambar
        const randomClass = `car${Math.floor(Math.random() * 3) + 1}`;
        enemyCar.classList.add(randomClass);

        // Posisi awal mobil musuh
        enemyCar.style.top = -Math.random() * 500 + 'px'; // Mulai di posisi acak dari atas
        enemyCar.style.left = Math.random() * (window.innerWidth - 50) + 'px'; // Posisi acak horizontal
        gameContainer.appendChild(enemyCar);

        // Menambahkan ke dalam array enemyCars
        enemyCars.push({
            element: enemyCar,
            x: parseFloat(enemyCar.style.left),
            y: parseFloat(enemyCar.style.top),
            speed: Math.random() * 1 + 2 // Kecepatan acak untuk mobil musuh
        });
    }

    // Menambahkan garis jalanan
    addRoadLines();



    requestAnimationFrame(gameLoop);
}

function addRoadLines() {
    for (let i = 0; i < 3; i++) {
        const roadLine = document.createElement('div');
        roadLine.classList.add('road-line');
        roadLine.style.top = `${i * 100}%`;
        road.appendChild(roadLine);
    }
}

function gameLoop() {
    if (gameRunning) {
        moveCar();
        moveCoin();
        moveEnemyCars();
        moveRoadline();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }
}

function moveCar() {
    if (carPositionX < 0) carPositionX = 0;
    if (carPositionX > window.innerWidth - 50) carPositionX = window.innerWidth - 50;
    car.style.left = carPositionX + 'px';
}

function moveCoin() {
    coinPositionY += coinSpeed;
    if (coinPositionY > window.innerHeight) {
        coinPositionY = -100;
        coinPositionX = Math.random() * (window.innerWidth - 50);
    }
    coin.style.top = coinPositionY + 'px';
    coin.style.left = coinPositionX + 'px';
}

function moveEnemyCars() {
    for (let i = 0; i < enemyCars.length; i++) {
        // Perbarui posisi Y mobil musuh
        enemyCars[i].y += enemyCars[i].speed;
        enemyCars[i].element.style.top = enemyCars[i].y + 'px';

        // Jika mobil musuh melewati layar, reset posisinya
        if (enemyCars[i].y > window.innerHeight) {
            enemyCars[i].y = -Math.random() * 500; // Reset posisi
            enemyCars[i].x = Math.random() * (window.innerWidth - 50); // Posisi horizontal baru
            enemyCars[i].element.style.left = enemyCars[i].x + 'px';
        }
    }
}

function moveRoadline() {
    // Menyebabkan roadline bergerak
    const roadlineTop = parseFloat(roadline.style.top || '0') + 5;
    roadline.style.top = roadlineTop + 'px';

    // Reset roadline ke posisi awal ketika mencapai bagian bawah layar
    if (roadlineTop > window.innerHeight) {
        roadline.style.top = '-100%';
    }
}

function checkCollisions() {
    const carRect = car.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    // Cek tabrakan antara mobil dan coin
    if (isCollision(carRect, coinRect)) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        coinPositionY = -100;
        coinPositionX = Math.random() * (window.innerWidth - 50);
    }

    // Cek tabrakan antara mobil dan mobil musuh
    for (let i = 0; i < enemyCars.length; i++) {
        const enemyCarRect = enemyCars[i].element.getBoundingClientRect();
        if (isCollision(carRect, enemyCarRect)) {
            endGame();
            break;
        }
    }
}

function isCollision(rect1, rect2) {
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function endGame() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = 'High Score: ' + highScore;
    }
    gameOverScreen.style.display = 'block';
    finalScoreDisplay.textContent = 'Final Score: ' + score;
}

function backToHome() {
    homeScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    gameOverScreen.style.display = 'none';
}

// Keyboard controls for desktop
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        carPositionX -= carSpeed;
    } else if (event.key === 'ArrowRight') {
        carPositionX += carSpeed;
    }
});

// Mobile controls for smooth swiping
let touchStartX = 0;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;  // Menyimpan posisi jari saat mulai menyentuh
});

window.addEventListener('touchmove', (e) => {
    const touchMoveX = e.touches[0].clientX;  // Menyimpan posisi jari saat bergerak
    const deltaX = touchMoveX - touchStartX;  // Menghitung perbedaan pergerakan horizontal

    carPositionX += deltaX;  // Memindahkan mobil sesuai gerakan jari

    if (carPositionX < 0) carPositionX = 0;  // Jangan biarkan mobil keluar dari layar di kiri
    if (carPositionX > window.innerWidth - 50) carPositionX = window.innerWidth - 50;  // Jangan biarkan mobil keluar dari layar di kanan

    car.style.left = carPositionX + 'px';  // Update posisi mobil
    touchStartX = touchMoveX;  // Perbarui posisi jari saat bergerak
});

// Mouse controls for PC
window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    carPositionX = mouseX - 25; // Menyelaraskan posisi mobil dengan kursor

    if (carPositionX < 0) carPositionX = 0; // Jangan biarkan mobil keluar dari layar di kiri
    if (carPositionX > window.innerWidth - 50) carPositionX = window.innerWidth - 50; // Jangan biarkan mobil keluar dari layar di kanan

    car.style.left = carPositionX + 'px';
});
