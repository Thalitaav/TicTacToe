import { useState } from 'react';
import './App.css';

function Cell({ content, onClick }) {
  return (
    <button className="cell" onClick={onClick}>
      {content}
    </button>
  );
}

function GameBoard({ boardState, onCellClick }) {
  const renderCell = (index) => (
    <Cell key={index} content={boardState[index]} onClick={() => onCellClick(index)} />
  );

  return (
    <div className="game-board">
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {renderCell(row * 3)}
          {renderCell(row * 3 + 1)}
          {renderCell(row * 3 + 2)}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isXNext, setIsXNext] = useState(true);

  const currentBoard = history[currentStep];
  const winner = checkWinner(currentBoard);

  function handleCellClick(i) {
    const slicedHistory = history.slice(0, currentStep + 1);
    const boardCopy = [...slicedHistory[slicedHistory.length - 1]];

    if (winner || boardCopy[i]) return;

    boardCopy[i] = isXNext ? 'X' : 'O';
    setHistory([...slicedHistory, boardCopy]);
    setCurrentStep(slicedHistory.length);
    setIsXNext(!isXNext);
  }

  function goToStep(step) {
    setCurrentStep(step);
    setIsXNext(step % 2 === 0);
  }

  const movesList = history.map((_, move) => {
    const label = move ? `Voltar para jogada #${move}` : 'Início do jogo';
    return (
      <li key={move}>
        <button onClick={() => goToStep(move)}>{label}</button>
      </li>
    );
  });

  const statusMessage = winner
    ? `Ganhador: ${winner}`
    : `Jogador atual: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="app-container">
      <div className="board-container">
        <GameBoard boardState={currentBoard} onCellClick={handleCellClick} />
      </div>
      <div className="history-container">
        <div>{statusMessage}</div>
        <ol>{movesList}</ol>
      </div>
    </div>
  );
}

function checkWinner(cells) {
  const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (const [a,b,c] of winningCombinations) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

export default App;
