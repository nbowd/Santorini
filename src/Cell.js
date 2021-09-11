import React from 'react';
import GamePiece from './GamePiece';
import './Cell.css'
import {grassBL, grassBM, grassBR, grassML, grassMM, grassMR, grassTL, grassTM, grassTR} from './assets/grass'

function Cell({ row, col, handleClick, CELLS, setCellColor, board}) {
  const setGrass = (row, col) => {
    const rest = [1,2,3,4]
    // Top row
    if (row === 0) {
      // Top left corner
        if (col === 0) {
          return `url(${grassTL})`
        }
      // Top right corner
        if (col === 4) {
          return `url(${grassTR})`
        }
      return `url(${grassTM})`
    }
    // Middle rows
    if (row in rest) {
      
      // Left side 
      if (col === 0) {
        return `url(${grassML})`        
      }
      // right side 
      if (col === 4) {
        return `url(${grassMR})`        
      }

      return `url(${grassMM})`
    }
    // Bottom row
    if (row === 4) {
      // Bottom left
      if (col === 0) {
        return `url(${grassBL})`
      }
      // Bottom right
      if (col === 4) {
        return `url(${grassBR})`
      }
      return `url(${grassBM})`
    }

  }
  return (
    <div   
      className='cell'
      onClick={() => handleClick(row,col)}
      style={{
        width: `${CELLS}px`,
        height: `${CELLS}px`,
        backgroundColor: board[row][col].level === 0? null: setCellColor(row,col),
        backgroundImage: board[row][col].level === 0?setGrass(row, col): null,
        border: '1px solid black'
      }}>
        {/* Player piece representations */}
        <GamePiece board={board} CELLS={CELLS} row={row} col={col}/>
    </div>
  )
}

export default Cell
