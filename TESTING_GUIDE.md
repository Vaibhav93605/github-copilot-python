# Testing Guide & Verification Checklist

## 🧪 Phase 1: Unit Tests

### Run Automated Tests

```bash
cd starter

# Install test dependencies
pip install -r requirements.txt

# Run all tests with verbose output
pytest test_sudoku_logic.py -v

# Run with coverage report
pytest test_sudoku_logic.py --cov=sudoku_logic -v
```

**Expected Output:**
- ✅ All 30+ tests should PASS
- Coverage should be 95%+ for sudoku_logic.py

**Screenshot to Save:** `Screenshots/01_testing_framework.png`

---

## 🎮 Phase 2: Manual Feature Testing

### Test Checklist - Complete ALL of these:

#### 1. **Game Startup**
- [ ] Navigate to http://127.0.0.1:5000
- [ ] Game loads without errors
- [ ] Board displays 9x9 grid
- [ ] Some cells are pre-filled (gray background)

**Screenshot:** `Screenshots/02_game_startup.png`

---

#### 2. **Difficulty Selector**
- [ ] Click difficulty dropdown
- [ ] Options show: Easy (40+ clues), Medium (30-39), Hard (<30)
- [ ] Select "Easy" → New Game generates with more clues
- [ ] Select "Hard" → New Game generates with fewer clues
- [ ] Count visible numbers changes based on difficulty

**Screenshot:** `Screenshots/03_difficulty_selector.png`

---

#### 3. **Timer**
- [ ] Click "New Game"
- [ ] Timer in top right shows "0:00"
- [ ] Timer increments to "0:01", "0:02", etc.
- [ ] Timer continues running while playing
- [ ] Format is correct (M:SS or MM:SS)

**Screenshot:** `Screenshots/04_timer_running.png` (capture at ~1:30 elapsed)

---

#### 4. **Hints System**
- [ ] Hints Used counter shows "0 / 3"
- [ ] Click "Get Hint" button
  - [ ] One empty cell fills with a number
  - [ ] Cell turns green background
  - [ ] Cell becomes locked (can't edit)
  - [ ] Hints Used counter increases to "1 / 3"
- [ ] Click "Get Hint" 2 more times
  - [ ] Counter shows "2 / 3", then "3 / 3"
  - [ ] After 3 hints, "Get Hint" button becomes disabled
  - [ ] Message shows "No hints remaining"

**Screenshot:** `Screenshots/05_hint_system.png` (showing 2-3 green hint cells)

---

#### 5. **Input Validation**
- [ ] Click empty cell, type "5"
  - [ ] Number appears in cell
- [ ] Type "a" or special character
  - [ ] Nothing appears (only 1-9 allowed)
- [ ] Try to edit pre-filled cell (gray)
  - [ ] Can't type (disabled)
- [ ] Try to edit hint cell (green)
  - [ ] Can't type (disabled)

**Screenshot:** `Screenshots/06_input_validation.png`

---

#### 6. **Real-time Conflict Detection**
- [ ] Enter a number in a cell
- [ ] Enter same number in another cell in same row
  - [ ] Both cells highlight orange (conflict)
  - [ ] Message shows "Incorrect entry" or similar
- [ ] Change one to different number
  - [ ] Conflict highlighting clears
- [ ] Try number in same 3×3 box
  - [ ] Same orange highlighting appears

**Screenshot:** `Screenshots/07_conflict_detection.png`

---

#### 7. **Check Puzzle Button**
- [ ] Fill in some cells incorrectly
- [ ] Click "Check Puzzle"
  - [ ] Incorrect cells turn red
  - [ ] Message shows number of incorrect cells
- [ ] Fill in those cells correctly
- [ ] Click "Check Puzzle" again
  - [ ] Red highlighting clears
  - [ ] Message shows "All entries are correct"

**Screenshot:** `Screenshots/08_check_puzzle.png`

---

#### 8. **Puzzle Completion**
- [ ] Fill entire board with all correct values
- [ ] Click "Check Puzzle"
  - [ ] Modal pops up: "🎉 Congratulations!"
  - [ ] Shows time taken (e.g., "2:45")
  - [ ] Shows difficulty level
  - [ ] Text field for entering name appears

**Screenshot:** `Screenshots/09_completion_modal.png`

---

#### 9. **Leaderboard - Save Score**
- [ ] In completion modal, type your name (e.g., "John")
- [ ] Click "Save Score"
  - [ ] Modal closes
  - [ ] Message shows "Score saved for John!"
  - [ ] Scroll down to "Top 10 Fastest Times"
  - [ ] Your score appears in the table:
    - [ ] Rank: 1
    - [ ] Name: John
    - [ ] Time: 2:45 (your time)
    - [ ] Level: Medium (or your difficulty)
    - [ ] Hints: 2 (your hint count)

**Screenshot:** `Screenshots/10_leaderboard_score_saved.png`

---

#### 10. **Leaderboard - Persistence**
- [ ] Complete another puzzle, save as "Sarah"
- [ ] Complete another puzzle, save as "Mike"
- [ ] Refresh the page (F5)
  - [ ] All 3 scores still appear in leaderboard
  - [ ] Sorted by time (fastest first)
  - [ ] No data lost

**Screenshot:** `Screenshots/11_leaderboard_persistence.png`

---

#### 11. **Top 10 Limit**
- [ ] Complete 12+ puzzles and save scores
- [ ] Leaderboard shows exactly 10 rows
- [ ] Slowest times are removed
- [ ] Fastest times remain

**Screenshot:** `Screenshots/12_top_10_limit.png`

---

#### 12. **Dark Mode Toggle**
- [ ] Click "🌙 Dark Mode" button in header
  - [ ] Entire page background turns dark
  - [ ] Text changes to light color
  - [ ] Board background is dark
  - [ ] All colors are readable
- [ ] Click again to toggle back to light mode
  - [ ] Page returns to light background
- [ ] Refresh page
  - [ ] Dark mode preference is remembered (persistent)

**Screenshot:** `Screenshots/13_dark_mode_toggle.png`

---

#### 13. **Responsive Design - Mobile View**
- [ ] Open game on desktop (Chrome DevTools)
- [ ] Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
- [ ] Set to iPhone 12 size
  - [ ] Game board is smaller but playable
  - [ ] All buttons and text are visible
  - [ ] Controls stack vertically
  - [ ] Leaderboard is scrollable
- [ ] Try on different sizes (iPad, etc.)
  - [ ] Layout adapts properly

**Screenshot:** `Screenshots/14_responsive_mobile.png`

---

#### 14. **New Game Button**
- [ ] Start a game and play for 30 seconds
- [ ] Click "New Game"
  - [ ] Timer resets to "0:00"
  - [ ] Hints Used resets to "0 / 3"
  - [ ] New puzzle loads (different numbers)
  - [ ] Previous board clears
  - [ ] Difficulty selector works

**Screenshot:** `Screenshots/15_new_game_reset.png`

---

## 📊 Summary Table

| Feature | Status | Screenshot |
|---------|--------|-----------|
| Testing Framework | ✅ | 01_testing_framework.png |
| Game Startup | ✅ | 02_game_startup.png |
| Difficulty Selector | ✅ | 03_difficulty_selector.png |
| Timer | ✅ | 04_timer_running.png |
| Hints System | ✅ | 05_hint_system.png |
| Input Validation | ✅ | 06_input_validation.png |
| Conflict Detection | ✅ | 07_conflict_detection.png |
| Check Puzzle | ✅ | 08_check_puzzle.png |
| Completion Modal | ✅ | 09_completion_modal.png |
| Save Score | ✅ | 10_leaderboard_score_saved.png |
| Persistence | ✅ | 11_leaderboard_persistence.png |
| Top 10 Limit | ✅ | 12_top_10_limit.png |
| Dark Mode | ✅ | 13_dark_mode_toggle.png |
| Mobile View | ✅ | 14_responsive_mobile.png |
| New Game Reset | ✅ | 15_new_game_reset.png |

---

## 🔍 Browser DevTools Verification

### Check Local Storage
1. Open DevTools: **F12**
2. Go to **Application** → **Local Storage** → **http://127.0.0.1:5000**
3. Verify these keys exist:
   - ✅ `sudokuScores` - JSON array of top 10 scores
   - ✅ `darkMode` - Boolean (true/false)

### Check Console
1. Open DevTools: **F12** → **Console**
2. No red errors should appear
3. Run this command:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('sudokuScores')))
   ```
4. Should display array of scores with structure:
   ```javascript
   [
     { name: "...", time: 245, hints: 2, difficulty: "medium", timestamp: ... }
   ]
   ```

---

## 🧪 Edge Cases to Test

- [ ] Complete puzzle without using hints
- [ ] Complete puzzle using all 3 hints
- [ ] Submit puzzle with empty cells → Should show errors
- [ ] Try entering 0 or negative numbers → Should be blocked
- [ ] Save score with special characters in name
- [ ] Complete puzzle in under 1 minute (0:45)
- [ ] Complete puzzle in over 10 minutes (10:30)

---

## ✅ Final Verification Checklist

Before submission, verify:

- [ ] All 15 feature tests passed
- [ ] All screenshots taken and in `Screenshots/` folder
- [ ] Unit tests pass: `pytest test_sudoku_logic.py -v`
- [ ] No console errors (F12 → Console)
- [ ] Local Storage has scores persisted
- [ ] Dark mode works and persists
- [ ] README.md is comprehensive
- [ ] Code is clean and documented
- [ ] Git history shows clear commits

---

## 📝 Troubleshooting

| Issue | Solution |
|-------|----------|
| Timer doesn't start | Refresh page, check console for errors |
| Hints not filling | Verify puzzle has empty cells |
| Leaderboard empty | Complete a puzzle and save with a name |
| Scores disappearing | Check Local Storage isn't disabled |
| Dark mode not persisting | Clear browser cache |
| Mobile view broken | Resize browser window, check CSS media queries |
| Tests failing | Run `pip install -r requirements.txt` again |

---

**Ready to test? Start with running the unit tests and taking screenshots!** 🚀
