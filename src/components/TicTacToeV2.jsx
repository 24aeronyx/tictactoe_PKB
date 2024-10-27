// TicTacToeV2.jsx
import React, { useState } from "react";

function TicTacToeV2() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [nodesEvaluated, setNodesEvaluated] = useState(0);
  const [execTime, setExecTime] = useState(0);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes(null) ? null : "Draw";
  };

  const minimaxWithAlphaBeta = (board, isMaximizing, alpha, beta) => {
    const winner = checkWinner(board);
    if (winner === "O") return { score: 10 };
    if (winner === "X") return { score: -10 };
    if (winner === "Draw") return { score: 0 };

    let bestMove;
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let localNodesEvaluated = 0;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = isMaximizing ? "O" : "X";
        const result = minimaxWithAlphaBeta(board, !isMaximizing, alpha, beta);
        board[i] = null;
        localNodesEvaluated++;

        if (isMaximizing) {
          if (result.score > bestScore) {
            bestScore = result.score;
            bestMove = i;
          }
          alpha = Math.max(alpha, bestScore);
        } else {
          if (result.score < bestScore) {
            bestScore = result.score;
            bestMove = i;
          }
          beta = Math.min(beta, bestScore);
        }

        if (beta <= alpha) break; // Alpha-Beta pruning
      }
    }

    setNodesEvaluated((prev) => prev + localNodesEvaluated);
    return { score: bestScore, move: bestMove };
  };

  const handleAIMove = () => {
    const start = performance.now();
    const { move } = minimaxWithAlphaBeta([...board], true, -Infinity, Infinity);
    const end = performance.now();
    setExecTime(end - start);

    if (move !== undefined) {
      let newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  const handleClick = (index) => {
    if (board[index] === null && isPlayerTurn) {
      let newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      setIsPlayerTurn(false);
      setNodesEvaluated(0);
      setExecTime(0);
      setTimeout(handleAIMove, 500);
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setNodesEvaluated(0);
    setExecTime(0);
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold mb-2">Tic-Tac-Toe dengan Alpha-Beta</h2>
      <div className="grid grid-cols-3 gap-2 w-64 mx-auto">
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="border p-4 text-2xl font-bold"
          >
            {value}
          </button>
        ))}
      </div>
      <p>Waktu Eksekusi: {execTime.toFixed(2)} ms</p>
      <p>Nodes Dievaluasi: {nodesEvaluated}</p>
      <button onClick={handleRestart} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Restart
      </button>
    </div>
  );
}

export default TicTacToeV2;
