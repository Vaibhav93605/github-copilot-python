"""
Test suite for sudoku_logic.py
Tests the core Sudoku puzzle generation and validation logic.
"""

import pytest
import sudoku_logic
from sudoku_logic import (
    SIZE, EMPTY, create_empty_board, is_safe, 
    fill_board, remove_cells, generate_puzzle, deep_copy
)


class TestBoardCreation:
    """Tests for board creation and initialization."""
    
    def test_create_empty_board(self):
        """Test that an empty board is created with correct dimensions."""
        board = create_empty_board()
        assert len(board) == SIZE
        assert all(len(row) == SIZE for row in board)
        assert all(cell == EMPTY for row in board for cell in row)
    
    def test_board_is_list_of_lists(self):
        """Test that board structure is a list of lists."""
        board = create_empty_board()
        assert isinstance(board, list)
        assert all(isinstance(row, list) for row in board)


class TestDeepCopy:
    """Tests for deep copy functionality."""
    
    def test_deep_copy_creates_independent_copy(self):
        """Test that deep_copy creates an independent copy."""
        original = create_empty_board()
        original[0][0] = 5
        
        copied = deep_copy(original)
        copied[0][0] = 9
        
        assert original[0][0] == 5
        assert copied[0][0] == 9
    
    def test_deep_copy_copies_nested_structure(self):
        """Test that deep copy preserves nested structure."""
        original = create_empty_board()
        original[2][3] = 7
        
        copied = deep_copy(original)
        assert copied[2][3] == 7


class TestIsSafe:
    """Tests for the is_safe validation function."""
    
    def test_is_safe_empty_board(self):
        """Test that any number is safe in an empty board."""
        board = create_empty_board()
        for num in range(1, SIZE + 1):
            assert is_safe(board, 0, 0, num) is True
    
    def test_is_safe_row_conflict(self):
        """Test that is_safe detects row conflicts."""
        board = create_empty_board()
        board[0][0] = 5
        board[0][5] = 5
        assert is_safe(board, 0, 8, 5) is False
    
    def test_is_safe_column_conflict(self):
        """Test that is_safe detects column conflicts."""
        board = create_empty_board()
        board[0][0] = 5
        board[8][0] = 5
        assert is_safe(board, 5, 0, 5) is False
    
    def test_is_safe_box_conflict(self):
        """Test that is_safe detects 3x3 box conflicts."""
        board = create_empty_board()
        board[0][0] = 5
        board[2][2] = 5  # Same 3x3 box
        assert is_safe(board, 1, 1, 5) is False
    
    def test_is_safe_no_conflict(self):
        """Test that is_safe returns True when placement is valid."""
        board = create_empty_board()
        board[0][0] = 5
        assert is_safe(board, 1, 1, 5) is True
        assert is_safe(board, 0, 1, 5) is False  # Same row
    
    def test_is_safe_different_numbers(self):
        """Test that different numbers don't conflict."""
        board = create_empty_board()
        board[0][0] = 1
        board[0][1] = 2
        board[1][0] = 3
        assert is_safe(board, 0, 2, 4) is True


class TestFillBoard:
    """Tests for the fill_board function."""
    
    def test_fill_board_returns_true_on_success(self):
        """Test that fill_board returns True when successful."""
        board = create_empty_board()
        result = fill_board(board)
        assert result is True
    
    def test_fill_board_completes_board(self):
        """Test that fill_board fills all cells."""
        board = create_empty_board()
        fill_board(board)
        assert all(cell != EMPTY for row in board for cell in row)
    
    def test_filled_board_is_valid(self):
        """Test that a filled board has no duplicate rows/cols/boxes."""
        board = create_empty_board()
        fill_board(board)
        
        # Check rows
        for row in board:
            assert len(set(row)) == SIZE
        
        # Check columns
        for col in range(SIZE):
            column = [board[row][col] for row in range(SIZE)]
            assert len(set(column)) == SIZE
        
        # Check 3x3 boxes
        for box_row in range(0, SIZE, 3):
            for box_col in range(0, SIZE, 3):
                box = []
                for i in range(3):
                    for j in range(3):
                        box.append(board[box_row + i][box_col + j])
                assert len(set(box)) == SIZE


class TestRemoveCells:
    """Tests for the remove_cells function."""
    
    def test_remove_cells_creates_empty_spaces(self):
        """Test that remove_cells creates empty cells."""
        board = create_empty_board()
        fill_board(board)
        original_count = sum(1 for row in board for cell in row if cell != EMPTY)
        
        remove_cells(board, 35)
        new_count = sum(1 for row in board for cell in row if cell != EMPTY)
        
        assert new_count == 35
        assert new_count < original_count
    
    def test_remove_cells_respects_clue_count(self):
        """Test that remove_cells leaves the specified number of clues."""
        for clues in [20, 30, 40, 50]:
            board = create_empty_board()
            fill_board(board)
            remove_cells(board, clues)
            remaining = sum(1 for row in board for cell in row if cell != EMPTY)
            assert remaining == clues


class TestGeneratePuzzle:
    """Tests for the generate_puzzle function."""
    
    def test_generate_puzzle_returns_tuple(self):
        """Test that generate_puzzle returns a tuple of (puzzle, solution)."""
        result = generate_puzzle()
        assert isinstance(result, tuple)
        assert len(result) == 2
    
    def test_generate_puzzle_default_clues(self):
        """Test that default clue count is around 35."""
        puzzle, solution = generate_puzzle(35)
        clue_count = sum(1 for row in puzzle for cell in row if cell != EMPTY)
        assert clue_count == 35
    
    def test_generate_puzzle_with_different_difficulties(self):
        """Test puzzle generation with different difficulty levels."""
        # Easy: 40+ clues
        easy_puzzle, easy_solution = generate_puzzle(40)
        easy_clues = sum(1 for row in easy_puzzle for cell in row if cell != EMPTY)
        assert easy_clues == 40
        
        # Medium: 30-39 clues
        medium_puzzle, medium_solution = generate_puzzle(35)
        medium_clues = sum(1 for row in medium_puzzle for cell in row if cell != EMPTY)
        assert medium_clues == 35
        
        # Hard: <30 clues
        hard_puzzle, hard_solution = generate_puzzle(25)
        hard_clues = sum(1 for row in hard_puzzle for cell in row if cell != EMPTY)
        assert hard_clues == 25
    
    def test_solution_is_different_from_puzzle(self):
        """Test that solution is different from puzzle."""
        puzzle, solution = generate_puzzle(35)
        
        # Count differences
        differences = sum(1 for i in range(SIZE) for j in range(SIZE) 
                         if puzzle[i][j] != solution[i][j])
        assert differences > 0
    
    def test_puzzle_clues_are_in_solution(self):
        """Test that all puzzle clues match the solution."""
        puzzle, solution = generate_puzzle(35)
        
        for i in range(SIZE):
            for j in range(SIZE):
                if puzzle[i][j] != EMPTY:
                    assert puzzle[i][j] == solution[i][j]
    
    def test_solution_is_valid(self):
        """Test that the solution is a valid completed puzzle."""
        puzzle, solution = generate_puzzle()
        
        # Check no empty cells
        assert all(cell != EMPTY for row in solution for cell in row)
        
        # Check rows have all numbers 1-9
        for row in solution:
            assert set(row) == set(range(1, SIZE + 1))
        
        # Check columns have all numbers 1-9
        for col in range(SIZE):
            column = [solution[row][col] for row in range(SIZE)]
            assert set(column) == set(range(1, SIZE + 1))
        
        # Check 3x3 boxes have all numbers 1-9
        for box_row in range(0, SIZE, 3):
            for box_col in range(0, SIZE, 3):
                box = []
                for i in range(3):
                    for j in range(3):
                        box.append(solution[box_row + i][box_col + j])
                assert set(box) == set(range(1, SIZE + 1))


class TestPuzzleProperties:
    """Tests for general puzzle properties."""
    
    def test_generated_puzzles_are_not_identical(self):
        """Test that multiple puzzle generations produce different puzzles."""
        puzzles = [generate_puzzle()[0] for _ in range(5)]
        
        # Check that at least some puzzles are different
        all_same = all(puzzles[0] == p for p in puzzles[1:])
        assert not all_same, "Multiple puzzle generations should produce different puzzles"
    
    def test_puzzle_dimensions(self):
        """Test that puzzles have correct 9x9 dimensions."""
        puzzle, solution = generate_puzzle()
        
        assert len(puzzle) == 9
        assert len(solution) == 9
        assert all(len(row) == 9 for row in puzzle)
        assert all(len(row) == 9 for row in solution)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
