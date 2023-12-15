import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
    let currentPlayer = 'X';

    if(gameTurns.length > 0 && gameTurns[0].player === 'X') {
      currentPlayer = 'O'
    }

    return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({
    'X': 'Player 1',
    'O': 'Player 2',
  });
  const [gameTurns, setGameTurns] = useState([]);
  
  const activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map(array => [...array])];

    for (const turn of gameTurns) {
        const { square, player} = turn;
        const { row, col } = square;

        gameBoard[row][col] = player;
    }
  
  let winner = null;

  for (const combinations of WINNING_COMBINATIONS) {
    const firstSquareSymbol = 
      gameBoard [combinations[0].row][combinations[0].column];
    const secondSquareSymbol = 
      gameBoard [combinations[1].row][combinations[1].column];
    const thirdSquareSymbol = 
      gameBoard [combinations[2].row][combinations[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      secondSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        {square: {row: rowIndex, col: colIndex}, player: currentPlayer}, 
        ...prevTurns,
      ];
      
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayer => {
      return {
        ...prevPlayer,
        [symbol]: newName
      };
    });
  }

  return <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        <Player 
          isActive={activePlayer === 'X'} 
          initialName="Player 1" 
          symbol="X"
          onChangeName = {handlePlayerNameChange}
        />
        <Player 
          isActive={activePlayer === 'O'} 
          initialName="Player 2" 
          symbol="O"
          onChangeName = {handlePlayerNameChange}
        />
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
      <GameBoard 
        onSelectSquare={handleSelectSquare} 
        board={gameBoard}
      />
    </div>
    <Log turns={gameTurns}/>
  </main>;
}

export default App
