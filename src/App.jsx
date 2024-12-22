import TicTacToe from "./components/TicTacToe";
import TicTacToeV2 from "./components/TicTacToeV2";
import TicTacToeMonteCarlo from "./components/TicTacToeMonteCarlo";

function App() {
  return (
    <div className="flex flex-col items-center gap-10 p-10 bg-gradient-to-bl from-blue-600 to-purple-600 min-h-screen">
      <h1 className="text-5xl text-center font-bold text-white mb-8 tracking-widest">
        Tic-Tac-Toe
      </h1>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex-1 flex justify-center">
          <TicTacToe />
        </div>
        <div className="flex-1 flex justify-center">
          <TicTacToeV2 />
        </div>
        <div className="flex-1 flex justify-center">
          <TicTacToeMonteCarlo />
        </div>
      </div>
    </div>
  );
}

export default App;