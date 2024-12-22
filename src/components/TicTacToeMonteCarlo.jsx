import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const TicTacToeMonteCarlo = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Giliran: Anda (X)");
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

  const simulateGame = (board, currentPlayer) => {
    const squaresCopy = [...board];
    let player = currentPlayer;

    while (true) {
      const validMoves = squaresCopy
        .map((val, idx) => (val === null ? idx : null))
        .filter((idx) => idx !== null);

      if (validMoves.length === 0) return null; // Draw
      const randomMove =
        validMoves[Math.floor(Math.random() * validMoves.length)];
      squaresCopy[randomMove] = player;

      const result = calculateWinner(squaresCopy);
      if (result) return result;

      player = player === "X" ? "O" : "X"; // Switch player
    }
  };

  const monteCarlo = (board, simulations = 100) => {
    const scores = Array(9).fill(0);
    const validMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((idx) => idx !== null);

    validMoves.forEach((move) => {
      for (let i = 0; i < simulations; i++) {
        const boardCopy = [...board];
        boardCopy[move] = "O"; // Simulate AI's move
        const result = simulateGame(boardCopy, "X");

        if (result === "O") scores[move] += 1; // AI wins
        else if (result === "X") scores[move] -= 1; // Player wins
      }
    });

    return scores.indexOf(Math.max(...scores));
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
      const aiMove = monteCarlo(squares, 500);
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
    setShowConfetti(false);
    setIsDraw(false);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${
        isDraw ? "bg-gray-500" : "from-green-500 to-teal-600"
      } w-full p-4 transition-colors duration-500`}
    >
      <h1 className="text-5xl font-bold text-white mb-8 tracking-widest animate-bounce">
        Tic-Tac-Toe Monte Carlo
      </h1>
      <div
        className={`grid grid-cols-3 gap-4 ${isDraw ? "animate-pulse" : ""}`}
      >
        {squares.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-24 h-24 flex items-center justify-center text-4xl font-bold rounded-lg shadow-md text-green-500 bg-white hover:bg-green-100 transition-colors duration-200 ${
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
          className="mt-4 px-6 py-2 bg-white text-green-600 font-bold rounded-lg shadow-md hover:bg-neutral-200 transition-all duration-200"
        >
          Mulai Ulang
        </button>
      </div>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
};

export default TicTacToeMonteCarlo;
