import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as leagueActions from './actions/leagueActions';
import * as teamsActions from './actions/teamsActions';
import * as routesActions from './actions/routesActions';
import * as dataActions from './actions/dataActions';
import ManageData from './components/ManageData';
import DraftTool from './components/DraftTool';
import ConfigureTeams from './components/ConfigureTeams';
import LandingPage from './components/LandingPage';
import './css/main.css';
import HeaderLinks from './components/HeaderLinks';
import ConfirmationPopup from './components/ConfirmationPopup';
import * as _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    this.leagueName = null;
  }

  handleEnterRoute = (nextState) =>{
    if(_.isEmpty(this.props.routes.leagueName)){
      this.props.routesActions.setLeagueName(nextState.params.leagueName);
    }
  }

  componentDidUpdate = (prevProps) => {
    this.leagueName = this.props.routes.leagueName;

    if(!this.leagueName) return;

    if(_.isEmpty(this.props.league)){
      this.props.leagueActions.getLeague({league:this.leagueName});
    }

    if(this.props.league.error){
      this.props.routesActions.setLeagueName(null);
      return;
    }
  }

  render() {
    return (
        <div className="App">
            <Provider store={this.props.store}>
              <Router>
                <div>
                  <HeaderLinks leagueName={this.leagueName}/>
                  <Route exact path="/" render={(props) => <LandingPage {...props}/>} />
                  <Route path="/:leagueName/draft" render={(props) => <DraftTool {...props} leagueName={this.leagueName} onEnterRoute={this.handleEnterRoute} league={this.props.league}/>}/>
                  <Route path="/:leagueName/data" render={(props) => <ManageData {...props} leagueName={this.leagueName} onEnterRoute={this.handleEnterRoute} league={this.props.league}/>}/>
                  <Route path="/:leagueName/teams" render={(props) => <ConfigureTeams {...props} leagueName={this.leagueName} onEnterRoute={this.handleEnterRoute}/>} league={this.props.league}/>
                  <ConfirmationPopup />
                </div>
              </Router>
            </Provider>
        </div>
    );
  }
}

function mapStateToProps(state, ownProps){
  return {
    league: state.league,
    teams: state.teams,
    routes: state.routes
  };
}

function mapDispatchToProps(dispatch){
 return {
   leagueActions: bindActionCreators(leagueActions, dispatch),
   teamsActions: bindActionCreators(teamsActions, dispatch),
   routesActions: bindActionCreators(routesActions, dispatch),
   dataActions: bindActionCreators(dataActions, dispatch),
 };
}

export default connect(mapStateToProps, mapDispatchToProps) (App);
