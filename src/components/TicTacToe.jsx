import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Giliran: Anda (X)");
  const [moveStats, setMoveStats] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDraw, setIsDraw] = useState(false);

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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
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

    let nodeCount = 0;
    const evaluate = (squares, maximizing) => {
      nodeCount++;
      const winner = calculateWinner(squares);
      if (winner === "X") return -1;
      if (winner === "O") return 1;
      if (!squares.includes(null)) return 0;

      if (maximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (squares[i] === null) {
            squares[i] = "O";
            bestScore = Math.max(bestScore, evaluate(squares, false));
            squares[i] = null;
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (squares[i] === null) {
            squares[i] = "X";
            bestScore = Math.min(bestScore, evaluate(squares, true));
            squares[i] = null;
          }
        }
        return bestScore;
      }
    };

    let start = performance.now();
    let score = evaluate(newSquares, isMaximizing);
    let end = performance.now();
    let executionTime = end - start;

    setMoveStats((prevStats) => [...prevStats, { executionTime, nodeCount }]);

    return score;
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
      setShowConfetti(true);
      setIsDraw(false);
    } else if (!squares.includes(null)) {
      setStatus("Seri!");
      setShowConfetti(false);
      setIsDraw(true);
    } else {
      setStatus(`Giliran: ${isXNext ? "Anda (X)" : "AI (O)"}`);
      setShowConfetti(false);
      setIsDraw(false);
    }
  }, [winner, squares, isXNext]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setStatus("Giliran: Anda (X)");
    setMoveStats([]);
    setShowConfetti(false);
    setIsDraw(false);
  };

  const calculateAverages = () => {
    const totalTime = moveStats.reduce(
      (acc, stat) => acc + stat.executionTime,
      0
    );
    const totalNodes = moveStats.reduce((acc, stat) => acc + stat.nodeCount, 0);
    const averageTime = totalTime / moveStats.length || 0;
    const averageNodes = totalNodes / moveStats.length || 0;

    return { averageTime, averageNodes };
  };

  const { averageTime, averageNodes } = calculateAverages();

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-full p-4 ${
        isDraw ? "bg-gray-500" : "bg-gradient-to-bl from-blue-500 to-indigo-600"
      } transition-colors duration-500`}
    >
      <h1 className="text-5xl font-bold text-white mb-8 tracking-widest text-center">
        MinMax w/out Alpha-Beta
      </h1>
      <div
        className={`grid grid-cols-3 gap-4 ${isDraw ? "animate-pulse" : ""}`}
      >
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
      <div className="mt-6 text-white text-lg text-center">
        <p>Rata-rata waktu eksekusi: {averageTime.toFixed(2)} ms</p>
        <p>Rata-rata node dievaluasi: {averageNodes.toFixed(0)}</p>
      </div>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
};

export default TicTacToe;
