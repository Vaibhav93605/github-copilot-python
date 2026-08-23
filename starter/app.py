from flask import Flask, render_template, jsonify, request
import sudoku_logic

app = Flask(__name__)

# Keep a simple in-memory store for current puzzle and solution
CURRENT = {
    'puzzle': None,
    'solution': None
}

@app.route('/')
def index():
    """Serve the main game page"""
    return render_template('index.html')

@app.route('/new')
def new_game():
    """
    Generate a new Sudoku puzzle with specified difficulty
    
    Query Parameters:
    - clues (int): Number of clues (pre-filled cells)
      - Easy: 40 clues
      - Medium: 35 clues
      - Hard: 25 clues
    
    Returns:
    - JSON with puzzle board
    """
    try:
        clues = int(request.args.get('clues', 35))
        
        # Validate clues parameter
        if clues < 17 or clues > 81:
            clues = 35  # Default to medium
        
        puzzle, solution = sudoku_logic.generate_puzzle(clues)
        CURRENT['puzzle'] = puzzle
        CURRENT['solution'] = solution
        
        return jsonify({'puzzle': puzzle})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/check', methods=['POST'])
def check_solution():
    """
    Check if the submitted puzzle solution is correct
    
    Request Body:
    - board (2D array): The user's completed or partial board
    
    Returns:
    - JSON with list of incorrect cell positions [row, col]
    - If all correct, returns empty list
    """
    try:
        data = request.json
        board = data.get('board')
        solution = CURRENT.get('solution')
        
        if solution is None:
            return jsonify({'error': 'No game in progress'}), 400
        
        if board is None:
            return jsonify({'error': 'No board submitted'}), 400
        
        # Find all incorrect cells
        incorrect = []
        for i in range(sudoku_logic.SIZE):
            for j in range(sudoku_logic.SIZE):
                # Compare user's entry with solution
                # Treat empty (0) cells as incorrect if solution has a value
                user_value = board[i][j] if board[i][j] != 0 else None
                solution_value = solution[i][j]
                
                if user_value != solution_value:
                    incorrect.append([i, j])
        
        return jsonify({'incorrect': incorrect})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True)
