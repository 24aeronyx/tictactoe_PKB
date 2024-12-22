import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const TicTacToeMonteCarlo = () => {
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

  const mcts = (initialSquares, player, iterations = 1000) => {
    let nodesEvaluated = 0; // Tambahkan penghitung global

    class Node {
      constructor(squares, parent = null) {
        this.squares = squares;
        this.parent = parent;
        this.children = [];
        this.visits = 0;
        this.wins = 0;
        this.player = player;
      }

      uctValue(totalSimulations) {
        if (this.visits === 0) return Infinity;
        return (
          this.wins / this.visits +
          Math.sqrt((2 * Math.log(totalSimulations)) / this.visits)
        );
      }
    }

    const root = new Node(initialSquares);

    const simulate = (squares, player) => {
      let currentPlayer = player;
      let winner = calculateWinner(squares);
      while (!winner && squares.includes(null)) {
        const availableMoves = squares
          .map((square, index) => (square === null ? index : null))
          .filter((index) => index !== null);

        const randomMove =
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
        squares[randomMove] = currentPlayer;
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        winner = calculateWinner(squares);
      }

      nodesEvaluated++; // Tambahkan saat simulasi selesai
      if (winner === "O") return 1;
      if (winner === "X") return -1;
      return 0;
    };

    const backpropagate = (node, result) => {
      while (node) {
        node.visits += 1;
        if (node.player === "O") {
          node.wins += result;
        } else {
          node.wins -= result;
        }
        node = node.parent;
      }
    };

    const expand = (node) => {
      const availableMoves = node.squares
        .map((square, index) => (square === null ? index : null))
        .filter((index) => index !== null);

      for (let move of availableMoves) {
        const newSquares = [...node.squares];
        newSquares[move] = node.player === "X" ? "O" : "X";
        node.children.push(new Node(newSquares, node));
        nodesEvaluated++; // Tambahkan saat node baru dibuat
      }
    };

    const select = (node) => {
      while (node.children.length > 0) {
        node = node.children.reduce((bestChild, child) =>
          child.uctValue(node.visits) > bestChild.uctValue(node.visits)
            ? child
            : bestChild
        );
      }
      return node;
    };

    for (let i = 0; i < iterations; i++) {
      let node = select(root);
      if (node.visits > 0 && node.children.length === 0) {
        expand(node);
      }
      const childNode = node.children.length > 0 ? node.children[0] : node;
      const result = simulate([...childNode.squares], childNode.player);
      backpropagate(childNode, result);
    }

    const bestChild = root.children.reduce((best, child) =>
      child.visits > best.visits ? child : best
    );

    return {
      move: bestChild.squares.findIndex(
        (val, idx) => val !== root.squares[idx]
      ),
      nodesEvaluated, // Kembalikan jumlah node yang dievaluasi
    };
  };

  // Memanggil AI
  const bestMove = () => {
    let start = performance.now();
    const { move, nodesEvaluated } = mcts(squares, "O", 1000);
    let end = performance.now();

    const executionTime = end - start;
    setMoveStats((prevStats) => [
      ...prevStats,
      { executionTime, nodesEvaluated },
    ]);
    return move;
  };

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i] || !isXNext) return;
    const newSquares = squares.slice();
    newSquares[i] = "X";
    setSquares(newSquares);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !calculateWinner(squares)) {
      const aiMove = bestMove();
      if (aiMove !== undefined) {
        const newSquares = squares.slice();
        newSquares[aiMove] = "O";
        setSquares(newSquares);
        setIsXNext(true);
      }
    }
  }, [isXNext, squares]);

  useEffect(() => {
    const winner = calculateWinner(squares);
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
  }, [squares, isXNext]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setStatus("Giliran: Anda (X)");
    setMoveStats([]);
    setShowConfetti(false);
    setIsDraw(false);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-full p-4 ${
        isDraw ? "bg-gray-500" : "bg-gradient-to-bl from-green-400 to-green-600"
      } transition-colors duration-500`}
    >
      <h1 className="text-5xl font-bold text-white mb-8 tracking-widest text-center">
        Monte Carlo Tree Search
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
        <p>
          Rata-rata waktu eksekusi:{" "}
          {(
            moveStats.reduce((a, b) => a + b.executionTime, 0) /
              moveStats.length || 0
          ).toFixed(2)}{" "}
          ms
        </p>
        <p>
          Rata-rata node dievaluasi:{" "}
          {Math.round(
            moveStats.reduce((a, b) => a + b.nodesEvaluated, 0) /
              moveStats.length
          ) || 0}
        </p>
      </div>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
};

export default TicTacToeMonteCarlo;
