import React, { useState } from 'react';
import produce, { current } from 'immer';
import './Game.css'; 
import diamond from './triangle.png'

function Game() {
  const SIZE = 5
  const CELLS = 100
  const generateEmptyGrid = () => Array.from({length: SIZE}).map(() => Array.from({length: SIZE}).fill({player: null, level:0}));
  const [board, setBoard] = useState(generateEmptyGrid())
  const [gameState, setGameState] = useState('UNFINISHED')
  const [currentTurn, setCurrentTurn] = useState('x')
  const [initialReady, setInitialReady] = useState({'x': 0, 'o': 0})

  console.log(board)

  const setCellColor = (row, col) => {
    const colors = {
      0: 'white',
      1: 'red',
      2: 'blue',
      3: 'green',
      4: 'black'
    }
 
    return colors[board[row][col].level]
  }

  const setCellPlayer = (row, col) => {
    const players = {
      'x': 'pink',
      'o': 'yellow'
    }

  }

  const handleClick = (row, col) => {
    if (initialReady[currentTurn] < 2) {
      console.log(initialReady);
      initialPlacement(row,col)
    } else {
      const newBoard = produce(board, boardCopy => {
        boardCopy[row][col].level = (boardCopy[row][col].level + 1)% 5
      })
      setBoard(newBoard)
      changeTurns()
    }
  }

 

  const changeTurns = () => {
    console.log('changing turns');
    if (currentTurn === 'x') {
      setCurrentTurn('o')
    } else if (currentTurn === 'o') {
      setCurrentTurn('x')
    }
  }

  const initialPlacement = (x, y) => {
    
    // Checks for pieces already in those positions
    if (board[x][y].player) {
      console.log('player there already');
      return false
    }

    const newBoard = produce(board, boardCopy => {
      console.log('adding player piece');
      boardCopy[x][y].player = currentTurn
    })
    setBoard(newBoard)
    setInitialReady(produce(initialReady, initialReadyCopy => {initialReadyCopy[currentTurn] = initialReadyCopy[currentTurn] + 1}))
    
    changeTurns()
    return true
  }

  const checkValidMove = (xStart, yStart, xFinish, yFinish) => {
    const xChange = Math.abs(xFinish - xStart)
    const yChange = Math.abs(yFinish - yStart)

    if (xChange > 1 || yChange > 1) {
      return false
    }
    if (!board[xStart][yStart] || !board[xFinish][yFinish]) {
      return false
    }
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
              }}>
                <div style={{width: `${CELLS}px`,height: `${CELLS}px`, fontSize:'60px', color: 'limegreen', pointerEvents:'none'}}>{board[i][k].player ? board[i][k].player: ''}</div>
                {/* <img src={diamond} style={{width: `${CELLS}px`,height: `${CELLS}px`}}></img> */}
              </div>))
        }
      </div>
    </div>
  )
}

export default Game
