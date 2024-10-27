import React, { useState } from 'react';

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [metrics, setMetrics] = useState({ time: 0, nodes: 0 });
    const winner = calculateWinner(board);

    const handleClick = (index) => {
        if (board[index] || winner) return;
        const newBoard = board.slice();
        newBoard[index] = 'X'; // Player is 'X'
        setBoard(newBoard);
        setIsXNext(false);
        if (!calculateWinner(newBoard) && !newBoard.every(Boolean)) {
            setTimeout(() => {
                makeOptimalMove(newBoard);
            }, 500); // Delay untuk memberikan waktu kepada pemain untuk melihat langkahnya
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setMetrics({ time: 0, nodes: 0 }); // Reset metrics
    };

    const minimax = (board, depth, isMaximizing) => {
        let nodesEvaluated = 1; // Count this node

        const winner = calculateWinner(board);
        if (winner) {
            return winner === 'X' ? 1 : -1; // Return score for maximizing player
        }
        if (board.every(Boolean)) {
            return 0; // Draw
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'O'; // AI is 'O'
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                    board[i] = null; // Undo move
                    nodesEvaluated++; // Count nodes evaluated in recursion
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'X'; // Player's move
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                    board[i] = null; // Undo move
                    nodesEvaluated++; // Count nodes evaluated in recursion
                }
            }
            return bestScore;
        }
    };

    const makeOptimalMove = (currentBoard) => {
        const start = performance.now(); // Start timer
        let bestScore = -Infinity;
        let bestMove = -1;
        let nodes = 0;

        for (let i = 0; i < currentBoard.length; i++) {
            if (!currentBoard[i]) {
                currentBoard[i] = 'O'; // Simulate AI's move
                const score = minimax(currentBoard, 0, false);
                currentBoard[i] = null; // Undo move
                nodes++; // Count nodes evaluated
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        setMetrics({ time: performance.now() - start, nodes: nodes });
        if (bestMove !== -1) {
            const newBoard = currentBoard.slice();
            newBoard[bestMove] = 'O'; // AI's move
            setBoard(newBoard);
            setIsXNext(true); // Switch back to player's turn
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
            <h1 className="text-4xl font-bold text-white mb-6 animate-bounce" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
                Tic Tac Toe
            </h1>
            <div className="grid grid-cols-3 gap-4">
                {board.map((value, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`flex items-center justify-center w-24 h-24 text-6xl font-bold rounded-lg transition-transform transform hover:scale-105 
                          ${value ? 'bg-gray-300 text-gray-700' : 'bg-white text-blue-500 hover:bg-blue-100'} 
                          ${winner ? 'cursor-default' : 'cursor-pointer'} 
                          shadow-lg`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <div className="mt-6 text-white text-xl">
                {winner && <p className="font-semibold text-center">{`Winner: ${winner}`}</p>}
                {!winner && board.every(Boolean) && <p className="font-semibold text-center">It's a Draw!</p>}
                <button
                    onClick={resetGame}
                    className="mt-4 px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-100"
                >
                    Reset Game
                </button>
                <div className="mt-4 text-lg">
                    <p>{`Execution Time: ${metrics.time.toFixed(2)} ms`}</p>
                    <p>{`Nodes Evaluated: ${metrics.nodes}`}</p>
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;
