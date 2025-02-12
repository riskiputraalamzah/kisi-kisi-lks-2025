document.addEventListener("DOMContentLoaded", () => {
  // Mendapatkan elemen-elemen yang diperlukan
  const instructionButton = document.querySelector(".instruction");
  const modal = document.getElementById("instruction-modal");
  const closeButton = document.querySelector(".close-button");
  const boxGame = document.querySelector(".box-game");
  const gameArea = document.querySelector(".game-area");
  const playerNameElement = document.getElementById("player-name");
  const playerScoreElement = document.getElementById("player-score");
  const gameTimerElement = document.getElementById("game-timer");
  const leaderboardContent = document.getElementById("leaderboard-content");
  const sortScoreButton = document.getElementById("sort-score");

  // Welcome screen elements
  const welcomeScreen = document.getElementById("welcome-screen");
  const player1NameInput = document.getElementById("player1-name");
  const player2NameInput = document.getElementById("player2-name");
  const playWithBotCheckbox = document.getElementById("play-with-bot");
  const gameLevelSelect = document.getElementById("game-level");
  const playGameButton = document.getElementById("play-game");

  // Enable/disable Play Game button based on input
  function updatePlayButtonState() {
    const player1Name = player1NameInput.value.trim();
    const player2Name = player2NameInput.value.trim();
    const gameLevel = gameLevelSelect.value;
    const playWithBot = playWithBotCheckbox.checked;

    if (player1Name && gameLevel && (playWithBot || player2Name)) {
      playGameButton.disabled = false;
    } else {
      playGameButton.disabled = true;
    }
  }

  player1NameInput.addEventListener("input", updatePlayButtonState);
  player2NameInput.addEventListener("input", updatePlayButtonState);
  playWithBotCheckbox.addEventListener("change", () => {
    player2NameInput.disabled = playWithBotCheckbox.checked;
    updatePlayButtonState();
  });
  gameLevelSelect.addEventListener("change", updatePlayButtonState);

  // Menampilkan modal instruksi saat tombol instruksi diklik
  instructionButton.addEventListener("click", () => {
    modal.classList.add("show");
  });

  // Menutup modal instruksi saat tombol close diklik
  closeButton.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  // Menutup modal instruksi saat area di luar modal diklik
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.classList.remove("show");
    }
  });

  // Menambahkan event listener untuk tombol play game
  playGameButton.addEventListener("click", () => {
    const player1Name = player1NameInput.value.trim();
    const player2Name = playWithBotCheckbox.checked
      ? "Bot"
      : player2NameInput.value.trim();
    const gameLevel = gameLevelSelect.value;

    document.getElementById("player1-name-display").innerText = player1Name;
    document.getElementById("player2-name-display").innerText = player2Name;

    welcomeScreen.style.display = "none";
    document.querySelector(".hexaria-container").style.display = "flex";

    initializeGame(gameLevel, player1Name, player2Name);
  });

  // Fungsi untuk memulai permainan
  function initializeGame(level, player1Name, player2Name) {
    hexariaBoard.innerHTML = "";
    hexagons = [];
    const disabledHexagons = getDisabledHexagons(level);
    for (let i = 0; i < 80; i++) {
      const hexagon = document.createElement("div");
      hexagon.className = "hexagon";
      if (disabledHexagons.includes(i)) {
        hexagon.classList.add("disabled");
      } else {
        hexagon.addEventListener("click", () => placeHexagon(i));
      }
      hexagons.push(hexagon);
      hexariaBoard.appendChild(hexagon);
    }
    updateCurrentHexagon();
    if (player2Name === "Bot") {
      setTimeout(botMove, 1000);
    }
  }

  function getDisabledHexagons(level) {
    const count = level === "easy" ? 4 : level === "medium" ? 6 : 8;
    const disabledHexagons = new Set();
    while (disabledHexagons.size < count) {
      disabledHexagons.add(Math.floor(Math.random() * 80));
    }
    return Array.from(disabledHexagons);
  }

  function updateCurrentHexagon() {
    currentHexagonValue = Math.floor(Math.random() * 20) + 1;
    currentHexagonElement.innerText = `Current Hexagon: ${currentPlayer} ${currentHexagonValue}`;
  }

  function placeHexagon(index) {
    const hexagon = hexagons[index];
    if (
      !hexagon.classList.contains("red") &&
      !hexagon.classList.contains("blue")
    ) {
      hexagon.classList.add(currentPlayer);
      hexagon.innerText = currentHexagonValue;
      updateScore();
      switchPlayer();
      updateCurrentHexagon();
      if (document.getElementById("player2-name-display").innerText === "Bot") {
        setTimeout(botMove, 1000);
      }
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === "red" ? "blue" : "red";
  }

  function updateScore() {
    player1Score = calculateScore("red");
    player2Score = calculateScore("blue");
    player1ScoreElement.innerText = `Player 1 Score: ${player1Score}`;
    player2ScoreElement.innerText = `Player 2 Score: ${player2Score}`;
  }

  function calculateScore(player) {
    return hexagons
      .filter((hexagon) => hexagon.classList.contains(player))
      .reduce((sum, hexagon) => sum + parseInt(hexagon.innerText), 0);
  }

  function botMove() {
    const emptyHexagons = hexagons.filter(
      (hexagon) =>
        !hexagon.classList.contains("red") &&
        !hexagon.classList.contains("blue")
    );
    if (emptyHexagons.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyHexagons.length);
      const hexagon = emptyHexagons[randomIndex];
      hexagon.classList.add(currentPlayer);
      hexagon.innerText = currentHexagonValue;
      updateScore();
      switchPlayer();
      updateCurrentHexagon();
    }
  }

  // Fungsi untuk menampilkan countdown
  function showCountdown(seconds, callback) {
    const countdownElement = document.createElement("div");
    countdownElement.className = "countdown";
    document.body.appendChild(countdownElement);

    let remainingSeconds = seconds;
    countdownElement.innerText = remainingSeconds;

    const interval = setInterval(() => {
      remainingSeconds -= 1;
      countdownElement.innerText = remainingSeconds;

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        document.body.removeChild(countdownElement);
        callback();
      }
    }, 1000);
  }

  // Fungsi untuk memulai permainan
  function startGame(level, username, gunImage, targetImage) {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d"); // Mendapatkan context 2D dari canvas
    const gunImg = new Image();
    const targetImg = new Image();
    const boomImg = new Image();
    const crosshairImg = new Image();
    gunImg.src = gunImage;
    targetImg.src = targetImage;
    boomImg.src = "./assets/Sprites/boom.png";
    crosshairImg.src = "./assets/Sprites/pointer.png";

    let time;
    let targetSpeed;
    let targetCount;
    let targetSize;
    switch (level) {
      case "easy":
        time = 30;
        targetSpeed = 1;
        targetCount = 3;
        targetSize = 100;
        break;
      case "medium":
        time = 20;
        targetSpeed = 2;
        targetCount = 4;
        targetSize = 75;
        break;
      case "hard":
        time = 15;
        targetSpeed = 3;
        targetCount = 5;
        targetSize = 50;
        break;
    }

    // Inisialisasi state permainan
    let score = 0;
    let targets = [];
    let gunX = canvas.width / 2 - 50;
    let gunY = canvas.height - 100;
    let crosshairX = 0;
    let crosshairY = 0;
    let boomEffect = null;

    // Memulai timer permainan
    gameTimerElement.innerText = `Time: ${time}s`;
    const interval = setInterval(() => {
      time -= 1;
      gameTimerElement.innerText = `Time: ${time}s`;

      if (time <= 0) {
        clearInterval(interval);
        endGame(score, username);
      }
    }, 1000);

    // Menambahkan target awal
    for (let i = 0; i < targetCount; i++) {
      addTarget();
    }

    // Menambahkan target baru setiap interval waktu tertentu
    const targetInterval = setInterval(() => {
      if (targets.length < targetCount) {
        addTarget();
      }
    }, 2000);

    // Fungsi untuk menambahkan target
    function addTarget() {
      const targetX = Math.random() * (canvas.width - targetSize);
      const targetY = Math.random() * (canvas.height - targetSize);
      const speedX = (Math.random() - 0.5) * targetSpeed;
      const speedY = (Math.random() - 0.5) * targetSpeed;
      targets.push({ x: targetX, y: targetY, speedX, speedY });
    }

    // Fungsi untuk menggambar elemen permainan
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Membersihkan canvas
      ctx.drawImage(gunImg, gunX - 50, canvas.height - 100, 100, 100); // Menggambar gambar senjata di canvas
      ctx.drawImage(crosshairImg, crosshairX - 25, crosshairY - 25, 50, 50); // Menggambar crosshair di canvas
      targets.forEach((target, index) => {
        target.x += target.speedX;
        target.y += target.speedY;

        // Memantulkan target jika mencapai tepi canvas
        if (target.x <= 0 || target.x >= canvas.width - targetSize) {
          target.speedX *= -1;
        }
        if (target.y <= 0 || target.y >= canvas.height - targetSize) {
          target.speedY *= -1;
        }

        ctx.drawImage(targetImg, target.x, target.y, targetSize, targetSize); // Menggambar target di canvas
      });

      // Menggambar efek ledakan jika ada
      if (boomEffect) {
        ctx.drawImage(boomImg, boomEffect.x, boomEffect.y, 100, 100);
      }

      requestAnimationFrame(draw); // Memanggil fungsi draw lagi pada frame berikutnya
    }

    // Event listener untuk menggerakkan crosshair dan senjata
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      crosshairX = event.clientX - rect.left;
      crosshairY = event.clientY - rect.top;
      gunX = crosshairX; // Menggerakkan senjata secara horizontal mengikuti pointer
    });

    // Event listener untuk menembak target
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      targets.forEach((target, index) => {
        if (
          x >= target.x &&
          x <= target.x + targetSize &&
          y >= target.y &&
          y <= target.y + targetSize
        ) {
          score += 1;
          playerScoreElement.innerText = `Score: ${score}`;
          targets.splice(index, 1);
          boomEffect = { x: target.x, y: target.y };
          setTimeout(() => {
            boomEffect = null;
          }, 500);
        }
      });
    });

    draw(); // Memulai proses menggambar

    // Fungsi untuk mengakhiri permainan
    function endGame(finalScore, username) {
      clearInterval(targetInterval);
      targets = [];

      // Menampilkan popup game over
      const gameOverElement = document.createElement("div");
      gameOverElement.className = "game-over";
      gameOverElement.innerHTML = `
        <h2>Game Over</h2>
        <p>Username: ${username}</p>
        <p>Score: ${finalScore}</p>
        <button class="save-score">Save Score</button>
        <button class="restart-game">Restart Game</button>
      `;
      document.body.appendChild(gameOverElement);

      // Event listener untuk menyimpan skor
      document.querySelector(".save-score").addEventListener("click", () => {
        saveScore(username, finalScore);
      });

      // Event listener untuk memulai ulang permainan
      document.querySelector(".restart-game").addEventListener("click", () => {
        document.body.removeChild(gameOverElement);
        boxGame.style.display = "flex";
        gameArea.style.display = "none";
        playGame();
      });
    }

    // Fungsi untuk menyimpan skor
    function saveScore(username, score) {
      const matchHistory =
        JSON.parse(localStorage.getItem("matchHistory")) || [];
      matchHistory.push({ username, score, date: new Date() });
      localStorage.setItem("matchHistory", JSON.stringify(matchHistory));
      updateLeaderboard();
    }

    // Fungsi untuk memperbarui leaderboard
    function updateLeaderboard() {
      const matchHistory =
        JSON.parse(localStorage.getItem("matchHistory")) || [];
      leaderboardContent.innerHTML = "";
      matchHistory.forEach((match) => {
        const item = document.createElement("div");
        item.className = "leaderboard-item";
        item.innerHTML = `
          <span>${match.username}: ${match.score}</span>
          <button onclick="showDetails('${match.username}', ${match.score})">Details</button>
        `;
        leaderboardContent.appendChild(item);
      });
    }

    // Event listener untuk mengurutkan skor
    sortScoreButton.addEventListener("click", () => {
      const matchHistory =
        JSON.parse(localStorage.getItem("matchHistory")) || [];
      matchHistory.sort((a, b) => b.score - a.score);
      localStorage.setItem("matchHistory", JSON.stringify(matchHistory));
      updateLeaderboard();
    });

    updateLeaderboard();
  }

  // Fungsi untuk menampilkan detail skor
  window.showDetails = (username, score) => {
    alert(`Username: ${username}\nScore: ${score}`);
  };

  // Hexaria game logic
  const hexariaContainer = document.querySelector(".hexaria-container");
  const hexariaBoard = document.querySelector(".hexaria-board");
  const player1ScoreElement = document.getElementById("player1-score");
  const player2ScoreElement = document.getElementById("player2-score");
  const currentHexagonElement = document.getElementById("current-hexagon");
  const newGameButton = document.getElementById("new-game");
  const currentTurnElement = document.getElementById("current-turn");

  let currentPlayer = "red";
  let currentHexagonValue = 1;
  let player1Score = 0;
  let player2Score = 0;
  let hexagons = [];

  function initializeGame(level, player1Name, player2Name) {
    hexariaBoard.innerHTML = "";
    hexagons = [];
    const disabledHexagons = getDisabledHexagons(level);
    for (let i = 0; i < 80; i++) {
      const hexagon = document.createElement("div");
      hexagon.className = "hexagon";
      if (disabledHexagons.includes(i)) {
        hexagon.classList.add("disabled");
      } else {
        hexagon.addEventListener("click", () => placeHexagon(i));
      }
      hexagons.push(hexagon);
      hexariaBoard.appendChild(hexagon);
    }
    updateCurrentHexagon();
    updateTurnIndicator();
  }

  function getDisabledHexagons(level) {
    const count = level === "easy" ? 4 : level === "medium" ? 6 : 8;
    const disabledHexagons = new Set();
    while (disabledHexagons.size < count) {
      disabledHexagons.add(Math.floor(Math.random() * 80));
    }
    return Array.from(disabledHexagons);
  }

  function updateCurrentHexagon() {
    currentHexagonValue = Math.floor(Math.random() * 20) + 1;
    currentHexagonElement.innerText = `Current Hexagon: ${currentPlayer} ${currentHexagonValue}`;
  }

  function updateTurnIndicator() {
    const playerName = currentPlayer === "red" ? "Player 1" : "Player 2";
    currentTurnElement.innerText = playerName;
    showTurnIndicatorAnimation(playerName);
  }

  function showTurnIndicatorAnimation(playerName) {
    const turnIndicator = document.createElement("div");
    turnIndicator.className = "turn-indicator-animation";
    turnIndicator.innerText = `${playerName}'s Turn`;
    document.querySelector(".hexaria-container").appendChild(turnIndicator);

    setTimeout(() => {
      document.querySelector(".hexaria-container").removeChild(turnIndicator);
    }, 2000);
  }

  function placeHexagon(index) {
    const hexagon = hexagons[index];
    if (
      !hexagon.classList.contains("red") &&
      !hexagon.classList.contains("blue")
    ) {
      hexagon.classList.add(currentPlayer);
      hexagon.innerText = currentHexagonValue;
      updateScore();
      switchPlayer();
      updateCurrentHexagon();
      updateTurnIndicator();
      if (document.getElementById("player2-name-display").innerText === "Bot") {
        setTimeout(botMove, 1000);
      }
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === "red" ? "blue" : "red";
  }

  function updateScore() {
    player1Score = calculateScore("red");
    player2Score = calculateScore("blue");
    player1ScoreElement.innerText = `Player 1 Score: ${player1Score}`;
    player2ScoreElement.innerText = `Player 2 Score: ${player2Score}`;
  }

  function calculateScore(player) {
    return hexagons
      .filter((hexagon) => hexagon.classList.contains(player))
      .reduce((sum, hexagon) => sum + parseInt(hexagon.innerText), 0);
  }

  function botMove() {
    const emptyHexagons = hexagons.filter(
      (hexagon) =>
        !hexagon.classList.contains("red") &&
        !hexagon.classList.contains("blue")
    );
    if (emptyHexagons.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyHexagons.length);
      const hexagon = emptyHexagons[randomIndex];
      hexagon.classList.add(currentPlayer);
      hexagon.innerText = currentHexagonValue;
      updateScore();
      switchPlayer();
      updateCurrentHexagon();
      updateTurnIndicator();
    }
  }

  newGameButton.addEventListener("click", () => {
    const player1Name = document.getElementById(
      "player1-name-display"
    ).innerText;
    const player2Name = document.getElementById(
      "player2-name-display"
    ).innerText;
    const gameLevel = document.getElementById("game-level").value;
    initializeGame(gameLevel, player1Name, player2Name);
  });

  initializeGame();
});
