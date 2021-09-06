import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import './Game.css'; 

function Game() {
  // Global variables
  const SIZE = 5
  const CELLS = 100

  // Creates array of arrays grid. Each cell starts with player = null and level = 0
  const generateEmptyGrid = () => Array.from({length: SIZE}).map(() => Array.from({length: SIZE}).fill({player: null, level:0, active: false}));
  const [board, setBoard] = useState(generateEmptyGrid())

  // Game state, turn state, initial player state
  const [gameState, setGameState] = useState('INITIAL')
  const [currentTurn, setCurrentTurn] = useState('x')
  const [initialReady, setInitialReady] = useState({'x': 0, 'o': 0})

  // Temporary storage to hold multiple click selections, 
  // is composed of start cell, finish cell, and build cell to create a valid move.
  const [currentMove, setCurrentMove] = useState([])
 
  // Color lookup function for inline styles, represents tower levels.
  const setCellColor = (row, col) => {
    const colors = {
      0: 'green',
      1: '#999999',
      2: '#444444',
      3: 'black',
      4: 'red'
    }
    return colors[board[row][col].level]
  }

  const changeTurns = useCallback(() => {
    console.log('changing turns');
    if (currentTurn === 'x') {
      setCurrentTurn('o')
    } else if (currentTurn === 'o') {
      setCurrentTurn('x')
    }
  }, [currentTurn])

  // If game just started, assigns initial clicks to piece placement,
  // alternating for each player until they have both pieces on the field.

  // While game is running, adds current move selection to currentMove state until is has collected start, stop, and build locations.

  // When a winner is decided, the logic will not advance but instead will just log out the winner.
  const handleClick = (row, col) => {
    if (gameState === 'INITIAL') {
      initialPlacement(row,col)
    } else if (gameState ==='UNFINISHED') {
      setBoard(produce(board, boardCopy => {
        boardCopy[row][col].active = true
      }))
      setCurrentMove([...currentMove, [row,col]])
    } else { // Winner declared
      console.log(gameState);
    }
  }

  const initialPlacement = (x, y) => {
    // Checks for pieces already in those positions
    if (board[x][y].player) {
      console.log('player there already');
      return false
    }

    // Update board
    const newBoard = produce(board, boardCopy => {
      console.log('adding player piece');
      boardCopy[x][y].player = currentTurn
    })
    setBoard(newBoard)

    // Updates initial piece state count
    setInitialReady(produce(initialReady, initialReadyCopy => {initialReadyCopy[currentTurn] = initialReadyCopy[currentTurn] + 1}))

    // All pieces have been played, switches handleClick() to its second functionality.
    if (initialReady['x'] + initialReady['o'] === 3) {
      setGameState('UNFINISHED')
    }
    changeTurns()

    return true
  }

  // Checks validity of the 3 value of the currentMove state, the build action. Doesn't allow for building on top of players, 
  // building out of range of finish position, or building on top of a domed tower. Voids entire move if invalid.
  const checkValidBuild = useCallback((moves) => {
    const xFinish = moves[1][0]
    const yFinish = moves[1][1]

    const xBuild = moves[2][0]
    const yBuild = moves[2][1]

    const xChange = Math.abs(xBuild - xFinish)
    const yChange = Math.abs(yBuild - yFinish)

    if (board[xBuild][yBuild].player) {
      console.log('cant build on player');
      return false
    }

    if (board[xBuild][yBuild].level === 4) {
      console.log('build at max height');
      return false
    }

    if (xChange > 1 || yChange > 1) {
      console.log('invalid build');
      return false
    }

    return true
  }, [board]);

  // Checks validity of start and finish position of the piece to be moved. Checks for correct game state, 
  // prevents impossible and invalid moves such as climbing a domed tower. Verifies that the player is only moving up one level at most.
  // Prevents play after the game has ended.
  const checkValidMove = useCallback((moves) => {
    const xStart = moves[0][0]
    const xFinish = moves[1][0]

    const yStart = moves[0][1]
    const yFinish = moves[1][1]

    const xChange = Math.abs(xFinish - xStart)
    const yChange = Math.abs(yFinish - yStart)
    console.log(xStart, yStart, currentTurn);

    if (gameState !== 'UNFINISHED') {

      return false
    }
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
  }, [board, currentTurn, gameState]);


  // Checks if the finish position of the recently moved piece is on a max height, non-domed tower.
  const checkWin = useCallback((x, y) => {
    if (board[x][y].level === 3) {
      setGameState(`${currentTurn} is WINNER`)
    }
  }, [board, currentTurn])

  // Makes the changes to the board if all of the validation has passed, checks for win condition, and changes turn.
  const makeMove = useCallback((moves) => {
    console.log('making move');
    const xStart = moves[0][0]
    const xFinish = moves[1][0]

    const yStart = moves[0][1]
    const yFinish = moves[1][1]

    const xBuild = moves[2][0]
    const yBuild = moves[2][1]

    const newBoard = produce(board, boardCopy => {
      boardCopy[xStart][yStart].player = null
      boardCopy[xFinish][yFinish].player = currentTurn
      boardCopy[xBuild][yBuild].level += 1
    })
    setBoard(newBoard)
    checkWin(xFinish,yFinish)
    changeTurns()    
  }, [board, changeTurns, checkWin, currentTurn]);

  const clearCurrentMove = useCallback(() => {
    setBoard(produce(board, boardCopy => {
      currentMove.forEach(move => {
        boardCopy[move[0]][move[1]].active = false
      })
    }))
  
  }, [board, currentMove])

  // Checks on each state update for a potential move, involving 3 entries to the currentMove state. A start point, stop point, and build point.
  useEffect(() => {
    console.log('move listener check');
    if (currentMove.length ===3) {
      let validMove = false
      if (currentMove.length === 3) {
        console.log(currentMove);
        validMove = checkValidMove(currentMove)
        if(!validMove) {
          clearCurrentMove()
          setCurrentMove([])
        }
      }
      let validBuild = false
      if (validMove) {
        console.log('can continue');
        validBuild = checkValidBuild(currentMove)
        
        if (!validBuild) {
          console.log('invalid build', validBuild);
          clearCurrentMove()
          setCurrentMove([])
        }
      }
      if (validBuild) { 
        makeMove(currentMove)
      }
    }    
  }, [currentMove, checkValidMove, clearCurrentMove, checkValidBuild, makeMove])
    
  

  return (
    <div>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${SIZE}, ${CELLS}px)`,
          justifyContent: 'center'
      }}>
        {board.map((rows, i) => 
          rows.map((cols, k) => 
            <div  
              key={`${i}-${k}`} 
              className='board-grid'
              onClick={() => handleClick(i,k)}
              style={{
                width: `${CELLS}px`,
                height: `${CELLS}px`,
                backgroundColor: setCellColor(i,k),
                border: '1px solid black'
              }}>
                {/* Player piece representations */}
                {/* <div style={{width: '10px', height: '10px', backgroundColor:'yellow', margin: 'auto'}}></div> */}
                <div className="cell" style={{width: `${CELLS/2}px`,height: `${CELLS/2}px`, backgroundColor: board[i][k].active? 'pink': null}}>{board[i][k].player ? board[i][k].player: ''}</div>
              </div>))
        }
      </div>
    </div>
  )
}

export default Game
