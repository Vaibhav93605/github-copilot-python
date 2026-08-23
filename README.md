# Sudoku Game - GitHub Copilot Project

A refactored Python Flask Sudoku game with modern features including difficulty levels, timer, hints, real-time validation, and a persistent leaderboard.

## Features

✅ **Game Features:**
- 9x9 Sudoku board with three difficulty levels (Easy/Medium/Hard)
- Real-time timer tracking puzzle solving time
- Hint system (max 3 hints per game) that fills correct cells
- Immediate feedback for invalid entries
- Solution checker with conflict highlighting
- Responsive design for desktop and mobile

✅ **User Experience:**
- Dark/Light mode toggle with persistence
- 3×3 Sudoku box alternating colors for clarity
- Live input validation (only 1-9 allowed)
- Visual feedback for conflicts and incorrect entries
- Accessibility-friendly color schemes

✅ **Leaderboard:**
- Top 10 fastest times with player names
- Saves difficulty level and hints used
- Persistent storage in browser local storage
- Automatic sorting by completion time

## Setup & Installation

### Prerequisites
- Python 3.7+
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd github-copilot-python/starter
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   - Navigate to `http://127.0.0.1:5000`
   - Start playing!

## How to Play

1. **Select Difficulty:** Choose Easy, Medium, or Hard from the dropdown
2. **Start New Game:** Click "New Game" button
3. **Fill the Board:** 
   - Click on empty cells and enter numbers 1-9
   - Pre-filled cells (gray) cannot be edited
   - Hint cells (green) cannot be edited
4. **Get Hints:** Click "Get Hint" (max 3 per game) to fill one correct cell
5. **Check Progress:** Click "Check Puzzle" to verify your entries
   - Red cells = incorrect
   - Orange cells = conflicts with same number in row/column/box
   - Green cells = correct entries
6. **Complete:** Fill all cells correctly to win
   - Enter your name to save your score to the leaderboard
   - Your score appears in Top 10 if fast enough

## Testing

### Run Unit Tests

```bash
# Navigate to starter directory
cd starter

# Run all tests
pytest test_sudoku_logic.py -v

# Run with coverage report
pytest test_sudoku_logic.py --cov=sudoku_logic -v
```

**Test Coverage:**
- Board creation and validation
- Sudoku rules enforcement (rows, columns, 3×3 boxes)
- Puzzle generation with difficulty levels
- Solution validation
- Deep copy functionality

All tests should pass ✓

## Project Structure

```
starter/
├── app.py                 # Flask backend with routes
├── sudoku_logic.py        # Core Sudoku puzzle generation logic
├── requirements.txt       # Python dependencies
├── test_sudoku_logic.py   # Unit tests
├── static/
│   ├── main.js           # Game logic and UI interactions
│   └── styles.css        # Styling and dark mode
└── templates/
    └── index.html        # Game interface HTML
```

## API Endpoints

### `GET /`
Serves the main game page

### `GET /new?clues=35`
Generate a new Sudoku puzzle
- **Query Parameters:**
  - `clues` (int): Number of pre-filled cells
    - Easy: 40 clues
    - Medium: 35 clues
    - Hard: 25 clues
- **Response:** `{ "puzzle": [[...]] }`

### `POST /check`
Validate the user's solution
- **Request Body:** `{ "board": [[...]] }`
- **Response:** `{ "incorrect": [[row, col], ...] }`

### `GET /health`
Health check endpoint

## Browser Local Storage

Scores are saved to browser local storage with the key `sudokuScores`:

```javascript
// Structure of saved score
{
  "name": "Player Name",
  "time": 245,           // in seconds
  "hints": 2,            // number of hints used
  "difficulty": "medium",
  "timestamp": 1692820000000
}
```

To view or manage scores in browser DevTools:
1. Press F12 to open Developer Tools
2. Go to Application → Local Storage → http://127.0.0.1:5000
3. Look for key: `sudokuScores`

## Dark Mode

Dark mode preference is saved to local storage as `darkMode`:
- Click the "🌙 Dark Mode" button in the header to toggle
- Your preference persists across browser sessions

## Technologies Used

- **Backend:** Python 3, Flask 2.0+
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Testing:** Pytest 7.0+
- **Storage:** Browser Local Storage API

## Difficulty Levels

| Level  | Clues | Difficulty |
|--------|-------|------------|
| Easy   | 40+   | Beginner   |
| Medium | 30-39 | Intermediate |
| Hard   | <30   | Advanced   |

## Features Implemented

### Core Game
- ✅ Puzzle generation with configurable difficulty
- ✅ Solution validation
- ✅ Cell conflict detection
- ✅ Input validation (1-9 only)

### User Interface
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Dark/Light mode toggle
- ✅ 3×3 box highlighting
- ✅ Real-time visual feedback
- ✅ Accessibility-friendly colors

### Game Features
- ✅ Difficulty selector
- ✅ Timer (MM:SS format)
- ✅ Hint system (max 3)
- ✅ Check puzzle button
- ✅ Completion message
- ✅ Leaderboard (Top 10)
- ✅ Score persistence

## Optional Enhancements (Standout Features)

- [ ] Number usage tracker (shows which numbers are used)
- [ ] Note mode (pencil marks for possibilities)
- [ ] Visual solver animation
- [ ] WCAG 2.1 AA accessibility standards
- [ ] Sound effects

## Troubleshooting

### "No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Timer not showing
- Refresh the page
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

### Scores not saving
- Check browser Local Storage in DevTools (F12 → Application)
- Ensure cookies/storage are not disabled
- Try a different browser
- Clear browser cache and try again

### Tests failing
```bash
# Reinstall test dependencies
pip install pytest pytest-cov

# Run tests with verbose output
pytest test_sudoku_logic.py -v
```

## Performance Notes

- Puzzles are generated on-demand (may take 1-2 seconds)
- Leaderboard is limited to Top 10 scores
- Local storage has ~5-10MB limit per domain

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is part of the GitHub Copilot learning course. See LICENSE.txt for details.

## Contributing

This is a learning project. Feel free to fork and experiment with enhancements!

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console errors (F12)
3. Check Local Storage in DevTools

---

**Last Updated:** August 2026
**Version:** 2.0 (Refactored with Copilot)
