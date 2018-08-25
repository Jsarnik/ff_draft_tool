import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import FileUpload from './components/FileUpload';
import DraftTool from './components/DraftTool';
import ConfigureTeams from './components/ConfigureTeams';
import LandingPage from './components/LandingPage';
import Roster from './components/Roster';
import './css/main.css';
import HeaderLinks from './components/HeaderLinks';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: null
    }
  }

  setLeague = (leagueName) =>{
    this.setState({
      league: leagueName
    });
  }

  render() {
    return (
      <div className="App">
        <HeaderLinks league={this.state.league}/>
        <Router>
          <div>
            <Route exact path="/" render={(props) => <LandingPage {...props} onLeagueSetFn={this.setLeague} />} />
            <Route exact path="/:league/draft" render={(props) => <DraftTool {...props} onLeagueSetFn={this.setLeague} />} />
            <Route path="/:league/upload" render={(props) => <FileUpload {...props} onLeagueSetFn={this.setLeague} />} />
            <Route path="/:league/teams" render={(props) => <ConfigureTeams {...props} onLeagueSetFn={this.setLeague} />} />
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
