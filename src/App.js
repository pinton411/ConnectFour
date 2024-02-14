import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import StartMenu from './StartMenu';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [boardRows, setBoardRows] = useState(6);
  const [boardCols, setBoardCols] = useState(7);
  const [opponent, setOpponent] = useState('player');
  const [playerColor, setPlayerColor] = useState('');
  const [opponentColor, setOpponentColor] = useState('');
  const [timeLeft, setTimeLeft] = useState(10000);

  const createBoard = useCallback((rows, cols) => (
      Array(rows).fill(null).map(() => Array(cols).fill(null))
  ), []);

  const startGame = useCallback((rows, cols, selectedOpponent, selectedPlayerColor, selectedOpponentColor) => {
    setBoardRows(rows);
    setBoardCols(cols);
    setOpponent(selectedOpponent);
    setPlayerColor(selectedPlayerColor);
    setOpponentColor(selectedOpponentColor);
    setBoard(createBoard(rows, cols));
    setCurrentPlayer(1);
    setWinner(null);
    setGameStarted(true);
    setTimeLeft(10000);
  }, [createBoard]);

  const checkForWin = useCallback((newBoard) => {
    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 }
    ];

    const checkDirection = (x, y, dx, dy) => {
      let count = 1;
      let i = 1;
      while (x + dx * i >= 0 && x + dx * i < boardCols && y + dy * i >= 0 && y + dy * i < boardRows && newBoard[y + dy * i][x + dx * i] === currentPlayer) {
        count++;
        i++;
      }
      i = 1;
      while (x - dx * i >= 0 && x - dx * i < boardCols && y - dy * i >= 0 && y - dy * i < boardRows && newBoard[y - dy * i][x - dx * i] === currentPlayer) {
        count++;
        i++;
      }
      return count >= 4;
    };

    for (let y = 0; y < boardRows; y++) {
      for (let x = 0; x < boardCols; x++) {
        if (newBoard[y][x] === currentPlayer) {
          for (const { x: dx, y: dy } of directions) {
            if (checkDirection(x, y, dx, dy)) {
              setWinner(currentPlayer);
              return;
            }
          }
        }
      }
    }
  }, [currentPlayer, boardRows, boardCols]);

  const dropPiece = useCallback((colIndex) => {
    if (winner) return;
    let dropped = false;
    const newBoard = board.map(row => [...row]);
    for (let row = boardRows - 1; row >= 0 && !dropped; row--) {
      if (newBoard[row][colIndex] === null) {
        newBoard[row][colIndex] = currentPlayer;
        dropped = true;
      }
    }
    if (dropped) {
      setBoard(newBoard);
      checkForWin(newBoard);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setTimeLeft(10000);
    }
  }, [board, boardRows, currentPlayer, winner, checkForWin]);

  useEffect(() => {
    if (gameStarted && opponent === 'computer' && currentPlayer === 2 && !winner) {
      const timer = setTimeout(() => {
        let col;
        do {
          col = Math.floor(Math.random() * boardCols);
        } while (!board[0][col] === null);
        dropPiece(col);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, opponent, currentPlayer, winner, boardCols, dropPiece, board]);

  useEffect(() => {
    let interval = null;
    if (gameStarted && timeLeft > 0 && !winner) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 100);
      }, 100);
    } else if (timeLeft <= 0) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setTimeLeft(10000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, winner, currentPlayer]);

  const renderCell = (rowIndex, colIndex) => {
    const cellValue = board[rowIndex][colIndex];
    const handleCellClick = () => {
      if (currentPlayer === 1 || (opponent === 'player' && currentPlayer === 2)) {
        dropPiece(colIndex);
      }
    };

    return (
        <div className="cell" key={`${rowIndex}-${colIndex}`} onClick={handleCellClick}>
          {cellValue !== null && (
              <motion.div
                  className={`piece player${cellValue}`}
                  style={{ backgroundColor: cellValue === 1 ? playerColor : opponentColor }}
                  initial={{ y: '-100vh' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
              ></motion.div>
          )}
        </div>
    );
  };

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setBoard(createBoard(boardRows, boardCols));
    setCurrentPlayer(1);
    setWinner(null);
    setTimeLeft(10000);
  }, [createBoard, boardRows, boardCols]);

  return (
      <div className="App">
        {!gameStarted ? (
            <StartMenu onStart={startGame} />
        ) : (
            <>
              <h2>Connect Four</h2>
              {winner ? (
                  <h3>{winner === 1 ? "Player 1 Wins!" : opponent === 'computer' ? "Computer Wins!" : "Player 2 Wins!"}</h3>
              ) : (
                  <h3>{currentPlayer === 1 ? "Player 1's Turn" : opponent === 'computer' ? "Computer's Turn" : "Player 2's Turn"}</h3>
              )}
              <div>Time left: {Math.floor(timeLeft / 1000)}.{(timeLeft % 1000) / 100}s</div>
              <div className="board" style={{gridTemplateColumns: `repeat(${boardCols}, 1fr)`}}>
                {board.map((row, rowIndex) => <div key={rowIndex} className="row">{row.map((cell, colIndex) => renderCell(rowIndex, colIndex))}</div>)}</div>
              {winner && <button onClick={resetGame}>New Game</button>}
            </>
        )}
      </div>
  );
}

export default App;
