import React from 'react';
import ReactDOM from 'react-dom';
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import './index.css';

function Square(props) {
  return (
    <button className = {props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "production") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

class Board extends React.Component {
  constructor(props) {
    super(props);
	const clearArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    this.state = {
      squares: clearArray,
      xIsNext: true,
      className: Array(25).fill('square'),
    };
	
    for(var i = 1; i < 26; i++){
      this.state.squares[i-1] = i;
    }
    this.assistant = initializeAssistant(() => this.getStateForAssistant() );

    this.assistant.on("data", (command) => {
      const { action } = command
      this.dispatchAssistantAction(action);
    });
	this.assistant.on("start", (event) => {
    });
  }
	
  getStateForAssistant () {
    const state = {
      squares: this.state.squares,
      xIsNext: this.state.xIsNext,
    };
    return state;
  }

  dispatchAssistantAction (action) {
    if (action) {
      switch (action.type) {
        case 'makeTurn':
          return this.handleClick(action.text);
        case 'restartGame':
          return this.restartGame();  
        default:
          throw new Error();
      }
    }
  }

  handleClick(i) {
    switch(i){
      case 'один':
        i = 1;
        break;
      case 'два':
        i = 2;
        break;
      case 'три':
        i = 3;
        break;
      case 'четыре':
        i = 4;
        break;
      case 'пять':
        i = 5;
        break;
      case 'шесть':
        i = 6;
        break;
      case 'семь':
        i = 7;
        break;
      case 'восемь':
        i = 8;
        break;
      case 'девять':
        i = 9;
        break;
      case 'десять':
        i = 10;
        break;
      case 'одиннадцать':
        i = 11;
        break;
      case 'двенадцать':
        i = 12;
        break;
      case 'тринадцать':
        i = 13;
        break;
      case 'четырнадцать':
        i = 14;
        break;
      case 'пятнадцать':
        i = 15;
        break;
      case 'шестнадцать':
        i = 16;
        break;
      case 'семнадцать':
        i = 17;
        break;
      case 'восемнадцать':
        i = 18;
        break;
      case 'девятнадцать':
        i = 19;
        break;
      case 'двадцать':
        i = 20;
        break;
      case 'двадцать один':
        i = 21;
        break;
      case 'двадцать два':
        i = 22;
        break;
      case 'двадцать три':
        i = 23;
        break;
      case 'двадцать четыре':
        i = 24;
        break;
      case 'двадцать пять':
        i = 25;
        break;
      default:
        break;
    }
    i = i -1;
    const squares = this.state.squares.slice();
    if ((calculateWinner(squares) || squares[i] === 'X' || squares[i] === 'O') && calculateWinner(squares) !== 100) {
		this.assistant.sendData({
		action: {
        action_id: 'errorBox',
        parameter: {}
		}}
		)
		return;
    }
	
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const className = this.state.className.slice();
    className[i] = this.state.xIsNext ? 'X' : 'O';
	if(calculateWinner(squares) !== 100 && calculateWinner(squares) !== 'X' && calculateWinner(squares) !== 'O'){
		this.assistant.sendData({
		  action: {
			action_id: 'madeTurn',
			parameter: {}
		  }}
		)
	}
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      className: className, 
    });
  }

  restartGame(){
	const clearArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    this.setState({
      squares: clearArray,
      xIsNext: true,
	  className: Array(25).fill('square'),
    });
  }

  renderSquare(i) {
      return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i+1)
        }
        className={this.state.className[i]}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner === 'X' || winner === 'O') {
      status = 'Победитель: ' + winner;
	  this.assistant.sendData({
      action: {
        action_id: 'gameOvers',
        parameter: {}
      }}
      )
    } 
    else {
      status = 'Ход игрока: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if(winner === 100){
      status = 'Ничья';
	  this.assistant.sendData({
      action: {
        action_id: 'gameOversNoWinner',
        parameter: {}
      }}
      )
    } 

	
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
        </div>
        <div className="board-row">
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
        <div className="board-row">
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
        </div>
        <div className="board-row">
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
        </div>
        <div className="board-row">
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
        </div>
			<button className="restartBtn" onClick={() => this.restartGame()}>Перезапустить игру</button>
			<button className="infoBtn" onClick={() => this.assistant.sendData({action: {action_id: 'infoEvent',parameter: {}}})}>Помощь</button>
			<button className="rulesBtn" onClick={() => this.assistant.sendData({action: {action_id: 'rulesEvent',parameter: {}}})}>Правила</button>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0,1,2,3],
    [1,2,3,4],
    [5,6,7,8],
    [6,7,8,9],
    [10,11,12,13],
    [11,12,13,14],
    [15,16,17,18],
    [16,17,18,19],
    [20,21,22,23],
    [21,22,23,24],
    [0,5,10,15],
    [5,10,15,20],
    [1,6,11,16],
    [6,11,16,21],
    [2,7,12,17],
    [7,12,17,22],
    [3,8,13,18],
    [8,13,18,23],
    [4,9,14,19],
    [9,14,19,24],
    [0,6,12,18],
    [6,12,18,24],
    [4,8,12,16],
    [8,12,16,20],
    [1,7,13,19],
    [5,11,17,23],
    [3,7,11,15],
    [9,13,17,21],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return squares[a];
    }
  }
  var check = Number(0);
  for(let i = 0; i < squares.length; i++) {
    if(squares[i] === 'X' || squares[i] === 'O'){
      check = check + 1;
    }
  }
  if(check === 25){
    return 100;
  }
  return null;
}