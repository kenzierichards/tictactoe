import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//onClick notifies the Board that it's been clicked on
//the board then calls the event handler
//displays the value passed to it by board
function Square(props) {
      return (
        <button className="square" 
                onClick={props.onClick}>
          { props.value } 
        </button>
      );
  }
  
  class Board extends React.Component {
    //creates a square whose value corresponds to the squares array
    //calls the handleCLick event when the Square component says it's been clicked on
    renderSquare(i) {
      return ( 
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
     //renders 9 Square components using the function, setting the i value as a parameter
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        //initialize state of board in Game, pass it down to Board
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0, //starts off with 0 step number
            xIsNext: true, //X goes first
        };
    }

    handleClick(i) {
        //gets rid of 'future history' if you go back in time
        const history = this.state.history.slice(0, this.state.stepNumber + 1); 

        //renders the currently selected move
        const current = history[this.state.stepNumber]; 

        //mutates state indirecctly
        //creates copy of squares array every time a square is clicked
        const squares = current.squares.slice();

        //exits early if square is already filled or a winner has been made
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        //sets X or O based on xIsNext
        squares[i] = this.state.xIsNext ? 'X' : '0';

        //sets state of board
        //creates a copy of the history array and adds squares to it (mutates indirectly)
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length, //sets the step number based on the number of moves
            xIsNext: !this.state.xIsNext, //flips X and O
          });
    }
    
    //goes back to specified move
    jumpTo(step) {
        this.setState({
            stepNumber: step, 
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        //has a button for each move
        //calls the jumpTo function when clicked
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move # ' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
        }

        //displays the state of the squares
        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares = {current.squares}
                    onClick = {(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{ status }</div>
                <ol>{ moves }</ol>
            </div>
            </div>
        );
    }
  }

  function calculateWinner(squares) {
    const lines = [ //spots that make tic tac toe
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  