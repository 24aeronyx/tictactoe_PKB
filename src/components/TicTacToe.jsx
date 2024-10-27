import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Giliran: Anda (X)");

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
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(squares);

  const minimax = (newSquares, isMaximizing) => {
    const winner = calculateWinner(newSquares);
    if (winner === "X") return -1;
    if (winner === "O") return 1;
    if (!newSquares.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (newSquares[i] === null) {
          newSquares[i] = "O";
          let score = minimax(newSquares, false);
          newSquares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (newSquares[i] === null) {
          newSquares[i] = "X";
          let score = minimax(newSquares, true);
          newSquares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const bestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        let score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const handleClick = (i) => {
    if (winner || squares[i] || !isXNext) return;
    const newSquares = squares.slice();
    newSquares[i] = "X";
    setSquares(newSquares);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      const aiMove = bestMove();
      if (aiMove !== undefined) {
        const newSquares = squares.slice();
        newSquares[aiMove] = "O";
        setSquares(newSquares);
        setIsXNext(true);
      }
    }
  }, [isXNext, squares, winner]);

  useEffect(() => {
    if (winner) {
      setStatus(`Pemenang: ${winner}`);
    } else if (!squares.includes(null)) {
      setStatus("Seri!");
    } else {
      setStatus(`Giliran: ${isXNext ? "Anda (X)" : "AI (O)"}`);
    }
  }, [winner, squares, isXNext]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setStatus("Giliran: Anda (X)");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-blue-500 to-indigo-600 w-full p-4">
      <h1
        className="text-5xl font-bold text-white mb-8 tracking-widest animate-bounce"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
      >
        Tic-Tac-Toe
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {squares.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-24 h-24 flex items-center justify-center text-4xl font-bold rounded-lg shadow-md text-blue-500 bg-white hover:bg-blue-100 transition-colors duration-200 ${
              square === "X" ? "text-blue-600" : "text-red-500"
            }`}
          >
            {square}
          </button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold text-white">{status}</h2>
        <button
          onClick={resetGame}
          className="mt-4 px-6 py-2 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-neutral-200 transition-all duration-200"
        >
          Mulai Ulang
        </button>
      </div>
      {winner && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </div>
  );
};

export default TicTacToe;
