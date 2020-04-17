import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import { CardsContianer, DrawMethod } from './CardsContainer';

interface AppProps { }
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {

  private countRef = React.createRef<HTMLInputElement>();
  private methodRef = React.createRef<HTMLSelectElement>();
  private containerRef = React.createRef<CardsContianer>();
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div className="root">
        <div>
          Count:<input type="text" ref={this.countRef} defaultValue="100" />
          Method:<select ref={this.methodRef}>
          {
            Object.keys(DrawMethod).filter(m => isNaN(DrawMethod[m])).map(m => <option value={m}>{DrawMethod[m]}</option>)
          }
          </select>
          <button onClick={this.onApplyClick}>Apply</button>
        </div>
        <CardsContianer ref={this.containerRef} />
      </div>
    );
  }

  private onApplyClick = () => {
    const container = this.containerRef.current;
    const count = Number(this.countRef.current.value);
    const method = Number(this.methodRef.current.value) as DrawMethod;
    container.changeValues(count, method);
  }
}

render(<App />, document.getElementById('root'));
