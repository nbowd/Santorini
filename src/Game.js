import React, { useState } from 'react';
import produce, { current } from 'immer';
import './Game.css'; 
import diamond from './triangle.png'

function Game() {
  const SIZE = 5
  const CELLS = 100
  const generateEmptyGrid = () => Array.from({length: SIZE}).map(() => Array.from({length: SIZE}).fill({player: null, level:0}));
  const [board, setBoard] = useState(generateEmptyGrid())
  const [gameState, setGameState] = useState('INITIAL')
  const [currentTurn, setCurrentTurn] = useState('x')
  const [initialReady, setInitialReady] = useState({'x': 0, 'o': 0})
  const [currentMove, setCurrentMove] = useState([])
  

  console.log(currentMove);
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

  const handleClick = (row, col) => {
    if (gameState === 'INITIAL') {
      if (initialReady[currentTurn] < 2) {
        initialPlacement(row,col)
      } 
    } else {
      // const newBoard = produce(board, boardCopy => {
      //   boardCopy[row][col].level = (boardCopy[row][col].level + 1)% 5
      // })
      // setBoard(newBoard)
      // changeTurns()
      if (currentMove.length < 3) {
        setCurrentMove([...currentMove, [row,col]])
      } 
      let validMove = false
      if (currentMove.length === 2) {
        validMove = checkValidMove(currentMove)
        if(!validMove) {
          setCurrentMove([])
        }
      }
      if (validMove) {
        console.log('can continue');
        setCurrentMove([])
      }
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

    if (initialReady['x'] + initialReady['o'] === 3) {
      setGameState('UNFINISHED')
    }
    changeTurns()
    return true
  }

  const checkValidMove = (moves) => {
    console.log('checking moves', moves);
    const xStart = moves[0][0]
    const xFinish = moves[1][0]

    const yStart = moves[0][1]
    const yFinish = moves[1][1]

    const xChange = Math.abs(xFinish - xStart)
    const yChange = Math.abs(yFinish - yStart)
    if (!(0 <= xStart <= 4) || !(0 <= xFinish <= 4) ||!(0 <= yStart <= 4) ||!(0 <= yFinish <= 4) ) {
      console.log('impossible move');
      return false
    }
    if (board[xStart][yStart].player !== currentTurn) {
      console.log('not current players piece');
      return false
    }
    if (board[xFinish][yFinish].player) {
      console.log('player already at finish location');
      return false
    }

    if (board[xFinish][yFinish].level >= 4) {
      console.log('cant move onto dome');
      return false
    }
    if (moves[0] === moves[1]) {
      console.log('didnt move anywhere');
      return false
    }

    if (xChange > 1 || yChange > 1) {
      console.log('invalid move');
      return false
    }

    if (board[xFinish][yFinish].level > board[xStart][yStart].level && (board[xFinish][yFinish].level - board[xStart][yStart].level) > 1) {
      console.log('cant leap more than one level up');
      return false
    }
  
    console.log('valid move');
    return true
  }

  const makeMove = (moves) => {
    if (gameState !== 'UNFINISHED') {
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
              </div>))
        }
      </div>
    </div>
  )
}

export default Game
