import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Data from './Data';
import Header from './Header';
import Home from './Home';
import LiveStream from './LiveStream';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <Header />
        <div class="container-fluid">
          <Switch>
            <Route path="/">
              <Home />
            </Route>
            <Route path="/data">
              <Data />
            </Route>
            <Route path="/live-stream">
              <LiveStream />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
