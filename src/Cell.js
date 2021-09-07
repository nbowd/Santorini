import React from 'react';
import GamePiece from './GamePiece';

function Cell({ row, col, handleClick, CELLS, setCellColor, board}) {
  return (
    <div   
      className='cell'
      onClick={() => handleClick(row,col)}
      style={{
        width: `${CELLS}px`,
        height: `${CELLS}px`,
        backgroundColor: setCellColor(row,col),
        border: '1px solid black'
      }}>
        {/* Player piece representations */}
        <GamePiece board={board} CELLS={CELLS} row={row} col={col}/>
    </div>
  )
}

export default Cell
