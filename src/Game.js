import React, { useState } from 'react';
import produce from 'immer';
import './Game.css'; 

function Game() {
  const SIZE = 5
  const CELLS = 100
  const generateEmptyGrid = () => Array.from({length: SIZE}).map(() => Array.from({length: SIZE}).fill(0));
  const [board, setBoard] = useState(generateEmptyGrid())

  const setCellColor = (row, col) => {
    const colors = {
      0: 'white',
      1: 'red',
      2: 'blue',
      3: 'green',
      4: 'black'
    }
    return colors[board[row][col]]
  }

  const handleClick = (row, col) => {
    const newBoard = produce(board, boardCopy => {
      boardCopy[row][col]= (boardCopy[row][col] + 1)% 5
    })
    setBoard(newBoard)
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZE}, ${CELLS}px)`,
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        {board.map((rows, i) => 
          rows.map((cols, k) => 
            <div  
              key={`${i}-${k}`} 
              onClick={() => handleClick(i,k)}
              style={{
                width: `${CELLS}px`,
                height: `${CELLS}px`,
                backgroundColor: setCellColor(i,k),
                border: '1px solid black'
              }}></div>))
        }
      </div>
    </div>
  )
}

export default Game
