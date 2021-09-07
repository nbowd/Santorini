import React from 'react'
import './GamePiece.css'

function GamePiece({CELLS, board, row, col}) {
  return (
    <div 
      className="piece" 
      style={{width: `${CELLS/2}px`,height: `${CELLS/2}px`, backgroundColor: board[row][col].active?'pink': null}}
    >
      {board[row][col].player ? board[row][col].player: ''}
    </div>
  )
}

export default GamePiece
