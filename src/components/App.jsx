import React, { Component } from 'react';
import LinkList from './LinkList';
import CreateLink from './CreatLink';
import Header from './Header';
import Login from './Login';
import { Switch, Route } from 'react-router-dom';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
