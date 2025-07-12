(() => {
    const gameArea = document.getElementById('gameArea');
    
    // Check if gameArea exists, important if script.js is loaded on non-game pages
    // If not on game page, setup only the general delete confirmation modal
    if (!gameArea) { 
        setupDeleteConfirmationModal();
        // Remove the outdated modal and button listeners if gameArea is not present
        const oldDeleteModal = document.getElementById('deleteModal');
        if (oldDeleteModal) oldDeleteModal.remove();
        document.querySelectorAll('.btn-delete').forEach(btn => btn.removeEventListener('click', null));
        return;
    }

    // --- Game Specific Logic (only if gameArea exists) ---
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const restartBtn = document.getElementById('restartBtn');
  
    const GAME_WIDTH = gameArea.clientWidth;
    const GAME_HEIGHT = gameArea.clientHeight;
  
    let score = 0;
    let lives = 3;
    let isPlaying = false;
    let isPaused = false;
    let playerX = GAME_WIDTH / 2 - player.clientWidth / 2;
    const playerY = GAME_HEIGHT - player.clientHeight - 20;
  
    let isDamaged = false;
    let damageTimeout = null;
  
    const PLAYER_SPEED = 7;
  
    const keys = {};
    const bullets = [];
    const enemies = [];
  
    let enemySpeedMultiplier = 1;
    let speedIncreaseTimer = null;
    const SPAWN_INTERVAL = 1500;
  
    const enemyTypes = [
      { type: 'ufo', points: 20, width: 50, height: 30, speedMin: 2, speedMax: 5, className: 'ufo' },
      { type: 'asteroid-big', points: 10, width: 60, height: 60, speedMin: 1, speedMax: 3, className: 'asteroid-big' },
      { type: 'asteroid-small', points: 100, width: 30, height: 30, speedMin: 3, speedMax: 7, className: 'asteroid-small' }
    ];
  
    let spawnIntervalId = null;
  
    function updateHUD() {
      scoreDisplay.textContent = `Pontuação: ${score}`;
      livesDisplay.innerHTML = '';
      for (let i = 0; i < lives; i++) {
        const img = document.createElement('img');
        img.src = 'assets/png/life.png';
        img.alt = 'vida';
        livesDisplay.appendChild(img);
      }
    }
  
    function updatePlayerPosition() {
      player.style.left = playerX + 'px';
      player.style.bottom = '20px';
    }
  
    function clampPlayerPosition() {
      if (playerX < 0) playerX = 0;
      if (playerX > GAME_WIDTH - player.clientWidth) playerX = GAME_WIDTH - player.clientWidth;
    }
  
    function spawnEnemy() {
      if (!isPlaying || isPaused) return;
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  
      const enemy = document.createElement('div');
      enemy.classList.add('enemy', enemyType.className);
  
      const posX = Math.random() * (GAME_WIDTH - enemyType.width);
      enemy.style.left = posX + 'px';
      enemy.style.top = '-' + enemyType.height + 'px';
      enemy.style.width = enemyType.width + 'px';
      enemy.style.height = enemyType.height + 'px';
  
      const speed = (Math.random() * (enemyType.speedMax - enemyType.speedMin) + enemyType.speedMin) * enemySpeedMultiplier;
  
      const enemyObj = {
        dom: enemy,
        type: enemyType.type,
        points: enemyType.points,
        width: enemyType.width,
        height: enemyType.height,
        x: posX,
        y: -enemyType.height,
        speed
      };
  
      enemies.push(enemyObj);
      gameArea.appendChild(enemy);
    }
  
    function moveEnemies() {
      enemies.forEach((enemy, index) => {
        if (isPaused) return;
        enemy.y += enemy.speed;
        if (enemy.y > GAME_HEIGHT) {
          enemy.dom.remove();
          enemies.splice(index, 1);
        } else {
          enemy.dom.style.top = enemy.y + 'px';
        }
      });
    }
  
    function shoot() {
      if (!isPlaying || isPaused) return;
      const bullet = document.createElement('div');
      bullet.classList.add('bullet');
  
      const bulletX = playerX + player.clientWidth / 2 - 3;
      const bulletY = playerY;
  
      bullet.style.left = bulletX + 'px';
      bullet.style.top = bulletY + 'px';
  
      const bulletObj = {
        dom: bullet,
        x: bulletX,
        y: bulletY,
        speed: 10
      };
      bullets.push(bulletObj);
      gameArea.appendChild(bullet);
    }
  
    function moveBullets() {
      bullets.forEach((bullet, index) => {
        if (isPaused) return;
        bullet.y -= bullet.speed;
        if (bullet.y < -20) {
          bullet.dom.remove();
          bullets.splice(index, 1);
        } else {
          bullet.dom.style.top = bullet.y + 'px';
        }
      });
    }
  
    function isColliding(objA, objB) {
      return !(
        objA.x + objA.width < objB.x ||
        objA.x > objB.x + objB.width ||
        objA.y + objA.height < objB.y ||
        objA.y > objB.y + objB.height
      );
    }
  
    function checkPlayerCollisions() {
      enemies.forEach((enemy, index) => {
        const playerRect = { x: playerX, y: playerY, width: player.clientWidth, height: player.clientHeight };
        const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };
        if (isColliding(playerRect, enemyRect) && !isDamaged) {
          loseLife();
          enemy.dom.remove();
          enemies.splice(index, 1);
        }
      });
    }
  
    function checkBulletCollisions() {
      bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
          const bulletRect = { x: bullet.x, y: bullet.y, width: 6, height: 15 };
          const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };
          if (isColliding(bulletRect, enemyRect)) {
            score += enemy.points;
            updateHUD();
            enemy.dom.remove();
            enemies.splice(eIndex, 1);
            bullet.dom.remove();
            bullets.splice(bIndex, 1);
          }
        });
      });
    }
  
    function loseLife() {
      lives--;
      updateHUD();
      if (lives <= 0) {
        gameOver();
        // REMOVIDO: onGameOver(scoreAtual) - Já é chamado dentro de gameOver()
        return;
      }
      isDamaged = true;
      player.classList.add('damaged');
      if (damageTimeout) clearTimeout(damageTimeout);
      damageTimeout = setTimeout(() => {
        isDamaged = false;
        player.classList.remove('damaged');
      }, 5000);
    }
  
    function gameOver() {
      isPlaying = false;
      gameOverScreen.style.display = 'flex';
      stopSpawning();
      stopSpeedIncrease();
      resetEnemySpeeds();
  
      // Send score to backend via AJAX
      if (score > 0) {
          fetch('/save-score', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ score: score }),
          })
          .then(response => {
              if (response.ok) {
                  console.log('Score saved successfully!');
              } else {
                  console.error('Failed to save score.');
              }
          })
          .catch(error => {
              console.error('Error sending score:', error);
          });
      }
    }
  
    function restartGame() {
      bullets.forEach(b => b.dom.remove());
      enemies.forEach(e => e.dom.remove());
      bullets.length = 0;
      enemies.length = 0;
  
      clearTimeout(damageTimeout);
      stopSpawning();
      stopSpeedIncrease();
      resetEnemySpeeds();
  
      score = 0;
      lives = 3;
      isDamaged = false;
      player.classList.remove('damaged');
      enemySpeedMultiplier = 1;
  
      updateHUD();
  
      playerX = GAME_WIDTH / 2 - player.clientWidth / 2;
      updatePlayerPosition();
  
      gameOverScreen.style.display = 'none';
      isPlaying = false;
      isPaused = false;
  
      gameArea.focus();
    }
  
    function startSpeedIncrease() {
      stopSpeedIncrease();
      speedIncreaseTimer = setInterval(() => {
        enemySpeedMultiplier *= 1.1;
      }, 6000);
    }
  
    function stopSpeedIncrease() {
      if (speedIncreaseTimer) {
        clearInterval(speedIncreaseTimer);
        speedIncreaseTimer = null;
      }
    }
  
    function resetEnemySpeeds() {
      enemies.forEach(enemy => {
        const enemyType = enemyTypes.find(e => e.type === enemy.type);
        if (enemyType) { // Ensure enemyType is found
            enemy.speed = (Math.random() * (enemyType.speedMax - enemyType.speedMin) + enemyType.speedMin) * enemySpeedMultiplier;
        }
      });
    }
  
    function gameLoop() {
      if (!isPlaying || isPaused) {
        requestAnimationFrame(gameLoop);
        return;
      }
  
      if (keys.ArrowLeft) playerX -= PLAYER_SPEED;
      if (keys.ArrowRight) playerX += PLAYER_SPEED;
      clampPlayerPosition();
      updatePlayerPosition();
  
      moveBullets();
      moveEnemies();
  
      checkBulletCollisions();
      checkPlayerCollisions();
  
      requestAnimationFrame(gameLoop);
    }
  
    function startSpawning() {
      stopSpawning();
      spawnIntervalId = setInterval(spawnEnemy, SPAWN_INTERVAL);
    }
  
    function stopSpawning() {
      if (spawnIntervalId) {
        clearInterval(spawnIntervalId);
        spawnIntervalId = null;
      }
    }
  
    gameArea.addEventListener('keydown', e => {
      if (e.repeat) return;
      switch (e.code) {
        case 'Space':
          if (!isPlaying) {
            isPlaying = true;
            isPaused = false;
            startSpeedIncrease();
            startSpawning();
            gameLoop();
          } else if (!isPaused) {
            shoot();
          }
          break;
        case 'KeyP':
          if (!isPlaying) return;
          isPaused = !isPaused;
          if (isPaused) {
              stopSpawning();
          } else {
              startSpawning();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          keys[e.code] = true;
          break;
      }
    });
    gameArea.addEventListener('keyup', e => {
      keys[e.code] = false;
    });
  
    restartBtn.addEventListener('click', restartGame);
  
    function init() {
      updateHUD();
      playerX = GAME_WIDTH / 2 - player.clientWidth / 2;
      updatePlayerPosition();
      gameArea.focus();
    }
    init();

    // Task 14: Delete Confirmation Modal setup
    function setupDeleteConfirmationModal() {
        // Expose a global function for delete confirmation
        window.confirmAndDelete = function(id, type) {
            // Inicializa o modal Bootstrap, ele precisa estar no DOM (main.handlebars)
            const modalElement = document.getElementById('deleteConfirmationModal');
            if (!modalElement) {
                console.error('Delete confirmation modal element not found!');
                return;
            }
            const modal = new bootstrap.Modal(modalElement); 

            const confirmBtn = modalElement.querySelector('#confirmDeleteBtn');
            const modalMessage = modalElement.querySelector('#modalMessage');

            // Set the data-id and data-type attributes on the confirm button
            confirmBtn.dataset.id = id;
            confirmBtn.dataset.type = type;

            if (type === 'major') {
                modalMessage.textContent = 'Deseja mesmo apagar este curso?';
            } else if (type === 'user') {
                modalMessage.textContent = 'Deseja mesmo apagar este usuário?';
            } else {
                modalMessage.textContent = 'Deseja mesmo apagar este item?';
            }

            // Remove previous event listener to avoid multiple bindings
            const oldConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(oldConfirmBtn, confirmBtn);

            oldConfirmBtn.addEventListener('click', function() {
                const itemId = oldConfirmBtn.dataset.id;
                const itemType = oldConfirmBtn.dataset.type;
                fetch(`/${itemType}/remove/${itemId}`, {
                    method: 'POST'
                })
                .then(response => {
                    if (response.ok) {
                        console.log(`${itemType} deletado com sucesso`);
                        modal.hide(); // Esconde o modal Bootstrap
                        window.location.reload(); // Recarrega a página
                    } else {
                        console.error(`Erro ao deletar ${itemType}`);
                        alert(`Erro ao deletar ${itemType}.`);
                        modal.hide(); // Esconde o modal Bootstrap
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);
                    alert('Erro na requisição.');
                    modal.hide(); // Esconde o modal Bootstrap
                });
            });

            // O botão de cancelar do modal Bootstrap já tem data-bs-dismiss="modal"
            // então não precisa de um listener separado para fechar.

            modal.show(); // Exibe o modal Bootstrap
        };
    }

    // REMOVIDO: Lógica antiga de modal de deleção (duplicada/conflitante)
    /*
    function onGameOver(score) {
      fetch('/game-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      });
    }

    let selectedUserId = null;

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', e => {
        selectedUserId = e.target.dataset.userid;
        document.getElementById('deleteModal').style.display = 'block';
      });
    });

    function closeModal() {
      document.getElementById('deleteModal').style.display = 'none';
    }

    document.getElementById('confirmDelete').addEventListener('click', () => {
      fetch('/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUserId })
      }).then(() => location.reload());
    });
    */

    // Call modal setup if gameArea is not present (meaning it's a non-game page)
    if (!gameArea) {
        setupDeleteConfirmationModal();
    }
  })();