import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const rootElement = document.getElementById('root')

function RepeatButton(props) {
  return (
    <button 
      aria-label='Play again.' 
      id='repeatButton' 
      onClick={props.onClick}
      disabled={props.disabled}>Spin!
    </button>
  );
}

function BetButtons({clickAction}) {
  return (
  <div>
    <button onClick={(e)=>{clickAction('1');}}>1</button>
    <button onClick={(e)=>{clickAction('2');}}>2</button>
    <button onClick={(e)=>{clickAction('3');}}>3</button>
    <button onClick={(e)=>{clickAction('4');}}>4</button>
    <button onClick={(e)=>{clickAction('5');}}>5</button>
  </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      won: 0,
      balance: 10,
      bet: 0,
      disabled: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.finishHandler = this.finishHandler.bind(this); 
  }  
handleChange=(event)=> {
  this.setState({
    value: event.target.value,
  });

}

  handleClick() { 
    this.setState({ winner: null, bet: 0 });
    if(this.state.balance > 0){
      this.setState({ 
        balance: this.state.balance - this.state.bet
      });
    } else {
      this.setState({ 
        bet: 0,
        disabled:true
      });
    }
    const audioplayer =ReactDOM.findDOMNode(this.refs.player);
    audioplayer.play();  
    this.emptyArray();
    this._child1.forceUpdateHandler();
    this._child2.forceUpdateHandler();
    this._child3.forceUpdateHandler();
  }


  static matches = [];

  finishHandler(value) {
    App.matches.push(value);  

    if (App.matches.length === 3) {
      const { winner } = this.state;
      const first = App.matches[0];
      let results = App.matches.every(match => match === first)
      this.setState({ winner: results });
    }
  }

  emptyArray() {
    App.matches = [];
  }

  render() {
    const { winner } = this.state;
    const { disabled } = this.state;
    const { bet } = this.state;

    let repeatButton = null;
    let  betButtons = null;
    
    betButtons = <BetButtons clickAction ={(betval) =>{this.setState({bet: betval})}} />
    
    if (winner !== null) {
      repeatButton = <RepeatButton onClick={this.handleClick} disabled={this.state.disabled}/>;
    }

    return (
      <div>
        <h1 id="title" >Spin To Win</h1>
        {winner === null ?<audio controls volume={this.state.value} autoPlay="autoplay" className="player" ref="player"preload="false">
          <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
        </audio>:<audio controls volume={this.state.value}autoPlay="autoplay" className="player" ref="player"preload="false">
        </audio>  }
        <div className={`spinner-container`}>
          <Spinner onFinish={this.finishHandler} ref={(child) => { this._child1 = child; }} timer="1400" />
          <Spinner onFinish={this.finishHandler} ref={(child) => { this._child2 = child; }} timer="2200" />
          <Spinner onFinish={this.finishHandler} ref={(child) => { this._child3 = child; }} timer="3000" />
        </div>
        <div className="dashboard">
          <h1>
            <span>{winner === null ? 'Waiting...' : winner ? 'You Won!!' : 'You Lost'}</span>
          </h1>
          <span className ="error">{disabled === true ? 'Reload to start new game' :''}</span>
          <div><span className="error">{bet === 0 ? 'Please add bet amount to win' :''}</span></div>
          <div>
            <label >Select Bet Amount</label>
            {betButtons}
          </div>
          <div className="output">
            <label>Won</label><button >{ winner ? this.setState({won: this.state.bet+this.state.won}) : this.state.won}</button>
            <label>Balance</label><button >{this.state.balance}</button>
            <label>Bet Amount</label><button >{this.state.bet}</button>
          </div>
        </div>
        {repeatButton}          
      </div>
    );
  }
}  
  
class Spinner extends React.Component {  
  constructor(props){
    super(props);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  };

  forceUpdateHandler(){
    this.reset();
  }; 

  reset() {
    if (this.timer) { 
      clearInterval(this.timer); 
    }  

    this.start = this.setStartPosition();

    this.setState({
      position: this.start,
      timeRemaining: this.props.timer        
    });

    this.timer = setInterval(() => {
      this.tick()
    }, 100);      
  }

  state = {
    position: 0,
    lastPosition: null
  }
  static iconHeight = 188;
  multiplier = Math.floor(Math.random()*(4-1)+1);

  start = this.setStartPosition();
  speed = Spinner.iconHeight * this.multiplier;    

  setStartPosition() {
    return ((Math.floor((Math.random()*9))) * Spinner.iconHeight)*-1;
  }

  moveBackground() {
    this.setState({ 
      position: this.state.position - this.speed,
      timeRemaining: this.state.timeRemaining - 100
    })
  }

  getSymbolFromPosition() {
    let { position } = this.state;
    const totalSymbols = 9;
    const maxPosition = (Spinner.iconHeight * (totalSymbols-1)*-1);
    let moved = (this.props.timer/100) * this.multiplier
    let startPosition = this.start;
    let currentPosition = startPosition;    

    for (let i = 0; i < moved; i++) {              
      currentPosition -= Spinner.iconHeight;

      if (currentPosition < maxPosition) {
        currentPosition = 0;
      }      
    }
    this.props.onFinish(currentPosition);
  }

  tick() {      
    if (this.state.timeRemaining <= 0) {
      clearInterval(this.timer);        
      this.getSymbolFromPosition();    
    } else {
      this.moveBackground();
    }      
  }

  componentDidMount() {
    clearInterval(this.timer);

    this.setState({
      position: this.start,
      timeRemaining: this.props.timer
    });

    this.timer = setInterval(() => {
      this.tick()
    }, 100);
  }

  render() {
    let { position, current } = this.state;   

    return (            
      <div 
        style={{backgroundPosition: '0px ' + position + 'px'}}
        className={`icons`}          
      />
    )
  }
}

function runApp() {
  ReactDOM.render(
    <App />,
    rootElement
  )
}
  
runApp();


export default App;
