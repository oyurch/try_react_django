import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import Posts from './posts/Posts'
import PostDetail from './posts/PostDetail'
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/posts' component={Posts}/>
          <Route exact path='/posts/:slug' component={PostDetail}/>
          <Route component={Posts}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
