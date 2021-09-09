import React, { useState } from 'react';
import './App.css';
import Game from './Game';
import Options from './Options';

function App() {
  const SIZE = 5
  const CELLS = 100
  const initState = 'ENDED'
  const initTurn = 'X'
  const initReady = {'X': 0, 'O': 0}
  const initStep = 'start'
  const initMove = {xStart: null, yStart: null, xFinish: null, yFinish: null, xBuild: null, yBuild: null}
  
  // Creates array of arrays grid. Each cell starts with player = null and level = 0
  const generateEmptyGrid = () => Array.from({length: SIZE}).map(() => Array.from({length: SIZE}).fill({player: null, level:0, active: false}));
  const [board, setBoard] = useState(generateEmptyGrid())

  // Game state, turn state, initial player state
  const [gameState, setGameState] = useState(initState)
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentTurn, setCurrentTurn] = useState(initTurn)
  const [initialReady, setInitialReady] = useState(initReady)

  // Temporary storage to hold multiple click selections, 
  // is composed of start cell, finish cell, and build cell to create a valid move.
  const [moveStep, setMoveStep] = useState(initStep)
  const [currentMove, setCurrentMove] = useState(initMove)
 
  let state = {
    SIZE: SIZE,
    CELLS: CELLS,
    board: board,
    setBoard: setBoard,
    gameState: gameState,
    setGameState: setGameState,
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessage,
    currentTurn: currentTurn,
    setCurrentTurn: setCurrentTurn,
    initialReady: initialReady,
    setInitialReady: setInitialReady,
    moveStep: moveStep,
    setMoveStep: setMoveStep,
    currentMove: currentMove,
    setCurrentMove: setCurrentMove,
  }

  const resetState = () => {
    setBoard(generateEmptyGrid())
    setGameState(initState)
    setCurrentTurn(initTurn)
    setInitialReady(initReady)
    setCurrentMove(initMove)
  }
 
  return (
    <div className="App">
      <Game  
        state={state}
      />
      <Options resetState={resetState} state={state}/>
    </div>
  );
}

export default App;
