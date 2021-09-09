import React, { useEffect, useCallback} from 'react';
import Cell from './Cell';
import produce from 'immer';
import './Game.css'; 

function Game({state}) {
  // Global variables
  const { SIZE, CELLS, board, setBoard, gameState, setGameState, currentTurn, setCurrentTurn, initialReady, setInitialReady, moveStep, setMoveStep, currentMove, setCurrentMove, setErrorMessage } = state
  // Color lookup function for inline styles, represents tower levels.
  const setCellColor = (row, col) => {
    const colors = {
      0: 'green', // ground level
      1: '#999999',
      2: '#444444',
      3: 'black',
      4: 'red'  // dome
    }
    return colors[board[row][col].level]
  }

  const changeTurns = useCallback(() => {
    if (currentTurn === 'X') {
      setCurrentTurn('O')
    } else if (currentTurn === 'O') {
      setCurrentTurn('X')
    }
  }, [currentTurn, setCurrentTurn])


  // Checks if the finish position of the recently moved piece is on a max height, non-domed tower.
  const checkWin = useCallback((x, y) => {
    if (board[x][y].level === 3) {
      setGameState(`WINNER WINNER ${currentTurn}!`)
    }
  }, [board, currentTurn, setGameState])

  // If game just started, assigns initial clicks to piece placement,
  // alternating for each player until they have both pieces on the field.

  // While game is running, adds current move selection to currentMove state until is has collected start, stop, and build locations.

  const initialPlacement = (x, y) => {
    // Checks for pieces already in those positions
    if (board[x][y].player) {
      console.log('player there already');
      return false
    }

    // Update board with immer
    setBoard(produce(board, boardCopy => {
      boardCopy[x][y].player = currentTurn
    }))

    // Updates initial piece state count with immer
    setInitialReady(produce(initialReady, initialReadyCopy => {
      initialReadyCopy[currentTurn] += 1
    }))

    // All pieces have been played, switches handleClick() to its second functionality.
    if (initialReady['X'] + initialReady['O'] === 3) {
      setGameState('UNFINISHED')
    }

    changeTurns()
    return true
  }

  // Checks current move step to correctly assign cell clicks to the currentMove object, advances moveStep when finished
  const addMove = (row,col) => {
    if (moveStep === 'start') {
      setCurrentMove(produce(currentMove, currentMoveCopy => {
        currentMoveCopy.xStart = row
        currentMoveCopy.yStart = col
      }))
      setMoveStep('stop')
    } else if (moveStep === 'stop') {
      setCurrentMove(produce(currentMove, currentMoveCopy => {
        currentMoveCopy.xFinish = row
        currentMoveCopy.yFinish = col
      }))
      setMoveStep('build')
    } else if (moveStep === 'build') {
      setCurrentMove(produce(currentMove, currentMoveCopy => {
        currentMoveCopy.xBuild = row
        currentMoveCopy.yBuild = col
      }))
      setMoveStep('start')
    }
  }

  // Checks validity of the currentMove build action. Doesn't allow for building on top of players, building on the destination cell, building out of range of finish position, or building on top of a domed tower. Voids entire move if invalid.
  const checkValidBuild = useCallback(({ xFinish, yFinish, xBuild, yBuild }) => {
    const xBuildChange = Math.abs(xBuild - xFinish)
    const yBuildChange = Math.abs(yBuild - yFinish)

    if (board[xFinish][yFinish] === board[xBuild][yBuild]) {
      console.log('cant build on destination');
      setErrorMessage('Can\'t build on destination')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    if (board[xBuild][yBuild].player) {
      console.log('cant build on player');
      setErrorMessage('Can\'t build on player')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    if (board[xBuild][yBuild].level === 4) {
      console.log('build at max height');
      setErrorMessage('Building at max height')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    if (xBuildChange > 1 || yBuildChange > 1) {
      console.log('invalid build, too far');
      setErrorMessage('Invalid build, too far')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    return true
  }, [board, setErrorMessage]);

  // Checks validity of start and finish position of the piece to be moved. Checks for correct game state, 
  // prevents impossible and invalid moves such as climbing a domed tower. Verifies that the player is only moving up one level at most.
  // Prevents play after the game has ended.
  const checkValidMove = useCallback(({ xStart, xFinish ,yStart, yFinish }) => {
    const xChange = Math.abs(xFinish - xStart)
    const yChange = Math.abs(yFinish - yStart)

    if (gameState !== 'UNFINISHED') {
      return false
    }

    // If somehow an input is not within board bounds
    if (!(0 <= xStart <= 4) || !(0 <= xFinish <= 4) ||!(0 <= yStart <= 4) ||!(0 <= yFinish <= 4) ) {
      console.log('impossible move');
      return false
    }

    // The piece being moved is not the current players, also catches cases where no initial piece was selected
    if (board[xStart][yStart].player !== currentTurn) {
      return false
    }

    // Can't move to another player's cell
    if (board[xFinish][yFinish].player) {
      console.log('player already at finish location');
      setErrorMessage('Player at destination')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    // Can't move on top of a dome
    if (board[xFinish][yFinish].level >= 4) {
      console.log('cant move onto dome');
      setErrorMessage('Can\'t move on top of dome')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    // Not an adjacent destination
    if (xChange > 1 || yChange > 1) {
      console.log('invalid move, too far');
      setErrorMessage('Invalid move, too far')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }

    // Can only move at most one level up. Can move any number of levels down.
    if (board[xFinish][yFinish].level > board[xStart][yStart].level && (board[xFinish][yFinish].level - board[xStart][yStart].level) > 1) {
      console.log('cant leap more than one level up');
      setErrorMessage('Can\'t move more than one level up')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }
    
    // Begins valid build checks, if those pass then the entire move is deemed valid.
    const validBuild = checkValidBuild(currentMove)
    if (!validBuild) {
      return false
    }

    return true

  }, [board, checkValidBuild, currentMove, currentTurn, gameState, setErrorMessage]);

  // Makes the changes to the board if all of the validation has passed, checks for win condition, and changes turn.
  const makeMove = useCallback(({xStart, xFinish, yStart, yFinish, xBuild, yBuild}) => {
    console.log('making move');
    const newBoard = produce(board, boardCopy => {
      boardCopy[xStart][yStart].player = null
      boardCopy[xFinish][yFinish].player = currentTurn
      boardCopy[xBuild][yBuild].level += 1
    })
    setBoard(newBoard)
    checkWin(xFinish,yFinish)
    changeTurns()    
  }, [board, changeTurns, checkWin, currentTurn, setBoard]);

  const clearCurrentMove = useCallback(() => {
    setBoard(produce(board, boardCopy => {
      boardCopy[currentMove.xStart][currentMove.yStart].active = false
      boardCopy[currentMove.xFinish][currentMove.yFinish].active = false
      boardCopy[currentMove.xBuild][currentMove.yBuild].active = false
    }))
  
  }, [board, currentMove.xBuild, currentMove.xFinish, currentMove.xStart, currentMove.yBuild, currentMove.yFinish, currentMove.yStart, setBoard])

  // When a winner is decided, the logic will not advance the game but instead will log out the winner.
  const handleClick = (row, col) => {
    if (gameState === 'INITIAL') {
      initialPlacement(row,col)
    } else if (gameState ==='UNFINISHED') {
      setBoard(produce(board, boardCopy => {boardCopy[row][col].active = true}))
      addMove(row,col)
    } else { // Winner declared
      console.log(gameState);
    }
  }

  // Checks on each state update for a potential move, involving 3 entries to the currentMove state. A start point, stop point, and build point.
  useEffect(() => {
    // Runs after 3 cell inputs have been registered
    if (currentMove.yBuild !== null) {
      if(!checkValidMove(currentMove)) {
        clearCurrentMove()
        setCurrentMove({xStart: null, yStart: null, xFinish: null, yFinish: null, xBuild: null, yBuild: null})
      } else { 
        makeMove(currentMove)
      }
    }    
  }, [currentMove, checkValidMove, clearCurrentMove, makeMove, setCurrentMove])
    
  return (
    <div 
      className='game-board'
      style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELLS}px)` }}>
      {board.map((rows, row) => 
        rows.map((cols, col) => 
          <Cell 
            key={`${row}-${col}`}
            handleClick={handleClick}
            CELLS={CELLS}
            setCellColor={setCellColor}
            board={board}
            row={row}
            col={col}
          />
        )
      )}
    </div>
  )
}

export default Game
