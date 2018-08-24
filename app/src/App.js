import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import FileUpload from './components/FileUpload';
import DraftTool from './components/DraftTool';
import ConfigureTeams from './components/ConfigureTeams';
import Roster from './components/Roster';
import logo from './logo.svg';
import './css/main.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header-bar">
          <div className="header-links flex-container">
            <div className="flex-item">
                <a href="/">Draft Board</a>
            </div>
            <div className="flex-item">
              <a href="/teams">Manage Teams</a>
            </div>
            <div className="flex-item">
              <a href="/upload">Manage Data</a>
            </div>
          </div>
        </div>
        <Router>
          <div>
            <Route exact path="/" component={DraftTool} />
            <Route path="/upload" component={FileUpload} />
            <Route path="/teams" component={ConfigureTeams} />
            <Route
              path="/roster/:teamName"
              component={Roster}
            />
          </div>
        </Router>
      </div>

    );
  }
}

export default App;
