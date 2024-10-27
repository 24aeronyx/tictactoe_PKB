import React, { useState } from 'react';
import Confetti from 'react-confetti';

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
    const [executionTimes, setExecutionTimes] = useState([]);
    const [nodeCounts, setNodeCounts] = useState([]);
    const [moveHistory, setMoveHistory] = useState([]); // Track moves made
    const winner = calculateWinner(board);

    const handleClick = (index) => {
        if (board[index] || winner || !isXNext) return;
        const newBoard = board.slice();
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsXNext(false);
        setMoveHistory((prev) => [...prev, { player: 'X', index }]); // Log move

        if (!calculateWinner(newBoard) && !newBoard.every(Boolean)) {
            setTimeout(() => {
                makeOptimalMove(newBoard);
            }, 500);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setMetrics({ time: 0, nodes: 0 });
        setExecutionTimes([]);
        setNodeCounts([]);
        setMoveHistory([]); // Reset move history
    };

    const minimax = (board, depth, isMaximizing) => {
        let nodesEvaluated = 1;
        const winner = calculateWinner(board);
        if (winner) {
            return winner === 'X' ? 1 : -1;
        }
        if (board.every(Boolean)) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board[i] = null;
                    nodesEvaluated++;
                    bestScore = Math.max(bestScore, score);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board[i] = null;
                    nodesEvaluated++;
                    bestScore = Math.min(bestScore, score);
                }
            }
            return bestScore;
        }
    };

    const makeOptimalMove = (currentBoard) => {
        const start = performance.now();
        let bestScore = -Infinity;
        let bestMove = -1;
        let nodes = 0;

        for (let i = 0; i < currentBoard.length; i++) {
            if (!currentBoard[i]) {
                currentBoard[i] = 'O';
                const score = minimax(currentBoard, 0, false);
                currentBoard[i] = null;
                nodes++;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        const executionTime = performance.now() - start;
        setMetrics({ time: executionTime, nodes: nodes });
        setExecutionTimes((prev) => [...prev, executionTime]);
        setNodeCounts((prev) => [...prev, nodes]);

        if (bestMove !== -1) {
            const newBoard = currentBoard.slice();
            newBoard[bestMove] = 'O';
            setBoard(newBoard);
            setIsXNext(true);
            setMoveHistory((prev) => [...prev, { player: 'O', index: bestMove, nodesEvaluated: nodes, executionTime }]); // Log AI move
        }
    };

    const averageTime = executionTimes.length ? (executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length).toFixed(2) : 0;
    const averageNodes = nodeCounts.length ? (nodeCounts.reduce((a, b) => a + b, 0) / nodeCounts.length).toFixed(0) : 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 relative w-full">
            {winner && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <h1 className="text-4xl font-bold text-white mb-6 animate-bounce" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
                Tic Tac Toe
            </h1>
            <div className="grid grid-cols-3 gap-4">
                {board.map((value, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`flex items-center justify-center w-24 h-24 text-6xl font-bold rounded-lg transition-transform transform hover:scale-105 
                          ${value ? 'bg-gray-300 text-blue-500' : 'bg-white text-blue-500 hover:bg-blue-100'} 
                          ${winner ? 'cursor-default' : 'cursor-pointer'} 
                          shadow-lg`}
                        disabled={winner || !isXNext}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <div className="mt-6 text-white text-xl flex flex-col">
                {winner && (
                    <p className="font-semibold text-4xl text-yellow-300 text-center bg-blue-800 p-4 rounded-lg shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' }}>
                        {`Winner: ${winner}`}
                    </p>
                )}
                {!winner && board.every(Boolean) && <p className="font-semibold text-center">It's a Draw!</p>}
                <button
                    onClick={resetGame}
                    className="mt-4 px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-100"
                >
                    Reset Game
                </button>
            </div>
            <div className="mt-4 text-lg text-center text-white">
                <p>{`Execution Time: ${metrics.time.toFixed(2)} ms`}</p>
                <p>{`Nodes Evaluated: ${metrics.nodes}`}</p>
                <p>{`Average Execution Time: ${averageTime} ms`}</p>
                <p>{`Average Nodes Evaluated: ${averageNodes}`}</p>
            </div>
            <div className="mt-6 text-white">
                <h2 className="text-xl font-bold">Move History</h2>
                <ul>
                    {moveHistory.map((move, index) => (
                        <li key={index} className="text-lg">
                            Player {move.player} moved at index {move.index} {move.nodesEvaluated !== undefined ? `(Nodes Evaluated: ${move.nodesEvaluated}, Time: ${move.executionTime.toFixed(2)} ms)` : ''}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TicTacToe;
