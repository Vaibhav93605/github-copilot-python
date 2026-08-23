// Global Game State
const SIZE = 9;
let gameState = {
  puzzle: [],
  solution: [],
  board: [],
  timerInterval: null,
  seconds: 0,
  hintsUsed: 0,
  maxHints: 3,
  difficulty: 'medium',
  isGameActive: false,
  conflictingCells: new Set()
};

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: 40,
  medium: 35,
  hard: 25
};

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', () => {
  initializeEventListeners();
  loadLeaderboard();
  loadDarkModePreference();
  startNewGame();
});

function initializeEventListeners() {
  document.getElementById('new-game').addEventListener('click', startNewGame);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint-button').addEventListener('click', getHint);
  document.getElementById('difficulty').addEventListener('change', (e) => {
    gameState.difficulty = e.target.value;
    startNewGame();
  });
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('save-score-btn').addEventListener('click', saveScore);
  document.getElementById('skip-score-btn').addEventListener('click', skipScore);
}

// ============================================
// DARK MODE
// ============================================

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
}

// ============================================
// GAME INITIALIZATION
// ============================================

async function startNewGame() {
  // Reset game state
  gameState.seconds = 0;
  gameState.hintsUsed = 0;
  gameState.isGameActive = true;
  gameState.conflictingCells.clear();
  
  // Clear timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  // Hide modal
  document.getElementById('completion-modal').classList.add('hidden');
  document.getElementById('message').innerText = '';
  document.getElementById('message').className = 'message';
  
  // Update UI
  updateHintsDisplay();
  updateTimerDisplay();
  
  // Fetch new puzzle
  const clues = DIFFICULTY_SETTINGS[gameState.difficulty] || 35;
  try {
    const res = await fetch(`/new?clues=${clues}`);
    const data = await res.json();
    
    gameState.puzzle = JSON.parse(JSON.stringify(data.puzzle));
    gameState.solution = JSON.parse(JSON.stringify(data.solution));
    gameState.board = JSON.parse(JSON.stringify(data.puzzle));
    
    renderPuzzle(gameState.puzzle);
    startTimer();
    
  } catch (error) {
    showMessage('Error loading puzzle. Please try again.', 'error');
    gameState.isGameActive = false;
  }
}

// ============================================
// BOARD RENDERING
// ============================================

function renderPuzzle(puzzle) {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = i;
      input.dataset.col = j;
      
      const val = puzzle[i][j];
      if (val !== 0) {
        input.value = val;
        input.disabled = true;
        input.className += ' prefilled';
      } else {
        input.value = '';
      }
      
      // Event listeners
      input.addEventListener('input', (e) => handleCellInput(e));
      input.addEventListener('change', (e) => validateCellInput(e));
      
      rowDiv.appendChild(input);
    }
    
    boardDiv.appendChild(rowDiv);
  }
}

// ============================================
// CELL INPUT HANDLING
// ============================================

function handleCellInput(e) {
  // Only allow numbers 1-9
  const val = e.target.value.replace(/[^1-9]/g, '');
  e.target.value = val;
  
  if (val) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    gameState.board[row][col] = parseInt(val);
  }
}

function validateCellInput(e) {
  if (!e.target.value) return;
  
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  const value = parseInt(e.target.value);
  
  clearConflicts();
  
  // Check if value matches solution (immediate feedback)
  if (value === gameState.solution[row][col]) {
    e.target.classList.remove('incorrect', 'conflict');
    showMessage('✓ Correct!', 'info');
  } else {
    e.target.classList.add('incorrect');
    showMessage('✗ Incorrect entry', 'error');
    highlightConflicts(row, col, value);
  }
}

function highlightConflicts(row, col, value) {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  
  // Highlight cells in same row
  for (let j = 0; j < SIZE; j++) {
    if (j !== col && inputs[row * SIZE + j].value == value) {
      inputs[row * SIZE + j].classList.add('conflict');
      gameState.conflictingCells.add(row * SIZE + j);
    }
  }
  
  // Highlight cells in same column
  for (let i = 0; i < SIZE; i++) {
    if (i !== row && inputs[i * SIZE + col].value == value) {
      inputs[i * SIZE + col].classList.add('conflict');
      gameState.conflictingCells.add(i * SIZE + col);
    }
  }
  
  // Highlight cells in same 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if ((i !== row || j !== col) && inputs[i * SIZE + j].value == value) {
        inputs[i * SIZE + j].classList.add('conflict');
        gameState.conflictingCells.add(i * SIZE + j);
      }
    }
  }
}

function clearConflicts() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  
  gameState.conflictingCells.forEach(idx => {
    inputs[idx].classList.remove('conflict');
  });
  
  gameState.conflictingCells.clear();
}

// ============================================
// HINT SYSTEM
// ============================================

function getHint() {
  if (gameState.hintsUsed >= gameState.maxHints) {
    showMessage(`❌ No hints remaining! (Max: ${gameState.maxHints})`, 'error');
    return;
  }
  
  if (!gameState.isGameActive) {
    showMessage('Start a new game to get hints.', 'info');
    return;
  }
  
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  
  // Find an empty cell
  let emptyCells = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      if (inputs[idx].value === '' && !inputs[idx].classList.contains('hint')) {
        emptyCells.push({ row: i, col: j, idx: idx });
      }
    }
  }
  
  if (emptyCells.length === 0) {
    showMessage('No empty cells for hints!', 'info');
    return;
  }
  
  // Pick a random empty cell and fill it
  const hint = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const correctValue = gameState.solution[hint.row][hint.col];
  
  inputs[hint.idx].value = correctValue;
  inputs[hint.idx].disabled = true;
  inputs[hint.idx].classList.add('hint');
  gameState.board[hint.row][hint.col] = correctValue;
  gameState.hintsUsed++;
  
  updateHintsDisplay();
  showMessage(`💡 Hint provided! (${gameState.hintsUsed}/${gameState.maxHints})`, 'info');
}

// ============================================
// SOLUTION CHECKING
// ============================================

async function checkSolution() {
  if (!gameState.isGameActive) {
    showMessage('Start a new game to check your solution.', 'info');
    return;
  }
  
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  
  try {
    const res = await fetch('/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board })
    });
    
    const data = await res.json();
    
    if (data.error) {
      showMessage(data.error, 'error');
      return;
    }
    
    // Clear previous incorrect marks
    for (let idx = 0; idx < inputs.length; idx++) {
      if (inputs[idx].classList.contains('incorrect')) {
        inputs[idx].classList.remove('incorrect');
      }
    }
    
    // Highlight incorrect cells
    const incorrect = new Set(data.incorrect.map(x => x[0] * SIZE + x[1]));
    incorrect.forEach(idx => {
      if (!inputs[idx].disabled) {
        inputs[idx].classList.add('incorrect');
      }
    });
    
    // Check if solved
    if (incorrect.size === 0 && isAllFilled(inputs)) {
      gameSolved();
    } else if (incorrect.size === 0) {
      showMessage('✓ All entries are correct! Complete the puzzle to finish.', 'success');
    } else {
      showMessage(`✗ ${incorrect.size} cell(s) are incorrect.`, 'error');
    }
    
  } catch (error) {
    showMessage('Error checking solution. Please try again.', 'error');
  }
}

function isAllFilled(inputs) {
  for (let idx = 0; idx < inputs.length; idx++) {
    if (inputs[idx].value === '') {
      return false;
    }
  }
  return true;
}

// ============================================
// GAME COMPLETION
// ============================================

function gameSolved() {
  gameState.isGameActive = false;
  
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  const timeString = formatTime(gameState.seconds);
  const message = `🎉 Congratulations! You solved it in ${timeString} with ${gameState.hintsUsed} hint(s)!`;
  
  showMessage(message, 'success');
  showCompletionModal(timeString);
}

function showCompletionModal(timeString) {
  const modal = document.getElementById('completion-modal');
  const message = document.getElementById('completion-message');
  
  message.innerText = `You solved the puzzle in ${timeString} on ${gameState.difficulty} difficulty!`;
  modal.classList.remove('hidden');
  
  document.getElementById('player-name').value = '';
  document.getElementById('player-name').focus();
}

function saveScore() {
  const playerName = document.getElementById('player-name').value.trim();
  
  if (!playerName) {
    showMessage('Please enter your name!', 'error');
    return;
  }
  
  const score = {
    name: playerName,
    time: gameState.seconds,
    hints: gameState.hintsUsed,
    difficulty: gameState.difficulty,
    timestamp: new Date().getTime()
  };
  
  addScoreToLeaderboard(score);
  document.getElementById('completion-modal').classList.add('hidden');
  showMessage(`✓ Score saved for ${playerName}!`, 'success');
}

function skipScore() {
  document.getElementById('completion-modal').classList.add('hidden');
  showMessage('Score not saved. Start a new game!', 'info');
}

// ============================================
// LEADERBOARD
// ============================================

function loadLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('sudokuScores') || '[]');
  displayLeaderboard(scores);
}

function addScoreToLeaderboard(newScore) {
  let scores = JSON.parse(localStorage.getItem('sudokuScores') || '[]');
  
  scores.push(newScore);
  
  // Sort by time (ascending)
  scores.sort((a, b) => a.time - b.time);
  
  // Keep only top 10
  scores = scores.slice(0, 10);
  
  localStorage.setItem('sudokuScores', JSON.stringify(scores));
  displayLeaderboard(scores);
}

function displayLeaderboard(scores) {
  const tbody = document.getElementById('leaderboard-body');
  
  if (scores.length === 0) {
    tbody.innerHTML = '<tr class="empty-state"><td colspan="5">No scores yet. Complete a puzzle to get on the leaderboard!</td></tr>';
    return;
  }
  
  tbody.innerHTML = scores.map((score, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(score.name)}</td>
      <td>${formatTime(score.time)}</td>
      <td>${score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}</td>
      <td>${score.hints}</td>
    </tr>
  `).join('');
}

// ============================================
// TIMER
// ============================================

function startTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  gameState.timerInterval = setInterval(() => {
    gameState.seconds++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timer').innerText = formatTime(gameState.seconds);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// HINTS DISPLAY
// ============================================

function updateHintsDisplay() {
  document.getElementById('hints-used').innerText = gameState.hintsUsed;
  document.getElementById('hints-remaining').innerText = gameState.maxHints - gameState.hintsUsed;
  
  const hintBtn = document.getElementById('hint-button');
  if (gameState.hintsUsed >= gameState.maxHints) {
    hintBtn.disabled = true;
  } else {
    hintBtn.disabled = false;
  }
}

// ============================================
// MESSAGE DISPLAY
// ============================================

function showMessage(text, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.innerText = text;
  messageEl.className = `message ${type}`;
  
  // Auto-clear info messages after 3 seconds
  if (type === 'info') {
    setTimeout(() => {
      messageEl.innerText = '';
      messageEl.className = 'message';
    }, 3000);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
