import { useState } from 'react'
import TicTacToe from './components/TicTacToe'
import TicTacToeV2 from './components/TicTacToeV2'

function App() {
  return (
    <div className="flex justify-between">
      <TicTacToe/>
      <TicTacToeV2/>
    </div>
  )
}

export default App
