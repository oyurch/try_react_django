import React, { Component } from 'react';

import Posts from './posts/Posts'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Posts/>
      </div>
    );
  }
}

export default App;
