import React from 'react'
import './GamePiece.css'
import blue from './assets/blue-player.png'
import red from './assets/red-player.png'

function GamePiece({CELLS, board, row, col}) {
  const setPlayer = (row,col) => {
    if (board[row][col].player === 'X') {
      return <img src={blue} alt="blue player piece"></img>
    }
    return <img src={red} alt="red player piece"></img>
  }
  return (
    <div 
      className="piece" 
      style={{
        width: `${CELLS/2}px`,
        height: `${CELLS/2}px`, 
        backgroundImage: board[row][col].player? setPlayer(row, col): null,
        backgroundColor: board[row][col].active?'lightgreen': null,
      }}
    >
      {board[row][col].player ? setPlayer(row, col): ''}
      
    </div>
  )
}

export default GamePiece
