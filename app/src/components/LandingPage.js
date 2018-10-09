import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Input from '../components/Input';
import axios from 'axios';
import config from '../globals';
import * as leagueActions from '../actions/leagueActions';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagueInfo: {
        league: null,
        displayName: null,
        owner: null
      },
      errorMessage: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

    handleChange = (params, val) =>{
      this.setState({
        ...this.state, leagueInfo: {...this.state.leagueInfo, [params]: val}
      });
    }

    findLeague = () =>{
      if(!this.state.leagueInfo.displayName){
        return;
      }

      this.props.leagueActions.getLeague(this.state.leagueInfo).then(res=>{
        let location = `${res.league}/draft`;
        this.props.history.push(location);
      }).catch(err=>{

      });
    }

    createLeague = () =>{
      if(!this.state.leagueInfo.displayName || !this.state.leagueInfo.owner){
        return;
      }

      this.props.leagueActions.createLeague(this.state.leagueInfo).then(res=>{
        let location = `${res.league}/draft`;
        this.props.history.push(location);
      }).catch(err =>{
        
      });
    }

   render() {
     return(
         <div>
           <div className="error-message">{this.state.errorMessage}</div>
           <div>
            <label>Existing Team (No spaces or special characters)</label>
            <Input type='text' value={this.state.leagueInfo.league} onChangeFn={this.handleChange} params='league'/>
            <div className="button" onClick={()=>this.findLeague()}>Find</div>
           </div>
           <div>
           <label>New Team Name (No spaces or special characters)</label>
            <Input type='text' value={this.state.leagueInfo.displayName} onChangeFn={this.handleChange} params='displayName'/>
            <label>Owner</label>
            <Input type='text' value={this.state.leagueInfo.owner} onChangeFn={this.handleChange} params='owner'/>
            <div className="button" onClick={()=>this.createLeague()}>Create</div>
           </div>
         </div>
     )
   }
 }

 function mapStateToProps(state, ownProps){
   return {
     league: state.leagueInfo
   };
 }

 function mapDispatchToProps(dispatch){
  return {
    leagueActions: bindActionCreators(leagueActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LandingPage));
