import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Teams from '../components/Teams';
import config from '../globals';
import Input from '../components/Input';
import * as _ from 'lodash';

class DraftTool extends Component {

    constructor(props) {
      super(props);
        if(!props.match.params.league){
          this.props.history.push('/');
        }

        props.onLeagueSetFn(props.match.params.league);

        this.state = {
          league: props.match.params.league,
          totalTeams: 10,
          teams: {},
          isEditTeamCount: false
        }

        this.tempTeam = {};
    }

    componentDidMount = () => {
      let url = `${config.baseApiUri}/api/getTeams`;
      let options = {
        league: this.state.league
      }

      axios.post(url, options)
        .then(res => {
          let data = res.data.data;
          this.updateTotalTeams(this.state.totalTeams, data);
        }).catch(e =>{
          console.log(e);
        });
    }

    updateTotalTeams = (totalTeams, currentTeams) =>{
      let currentTeamsList = Object.keys(currentTeams);
      let emptyTeams = totalTeams - currentTeamsList.length;
      let updated = false;

      if(emptyTeams >= 0){
          updated = true;
          for(let i = 0; i<emptyTeams; i++){
            let keyVal = recursiveKeyCheck('temp', i);
            currentTeams[keyVal] = {
                  name: null,
                  owner: null
              }
          }
      }else{
        let deletedCount = 0;
        _.each(currentTeams, (t, key)=>{
          if(key.indexOf('temp') !== -1 && deletedCount < Math.abs(emptyTeams)){
            updated = true;
            delete currentTeams[key];
            deletedCount++;
          }
        });
      }

      if(updated){
        this.setState({ 
          totalTeams: totalTeams,
          teams: currentTeams
        });
      }

      function recursiveKeyCheck(s, i){
        let key = `${s}_${i}`;
        i++;
        return !currentTeams[key] ? key : recursiveKeyCheck(s, i);
      }
    }

    handleChange = (params, value) =>{
      this.setState({
        teams: {...this.state.teams, [params.prop1]: {...this.state.teams[params.prop1], [params.prop2]: value}}
      });
    }

    updateTeam = (key, team, isEdit, isDelete) =>{
      if((!team.displayName || !team.owner) && !isDelete) return;
      team.league = this.state.league;

      let formattedId = team.displayName.replace(/[^A-Z0-9]/ig, "_");
      let teamsCopy = this.state.teams;
      
      if(isDelete){
        delete teamsCopy[formattedId];
        this.updateTeamsDB(team, teamsCopy, true);
        return;
      }

      if(isEdit){
        team.isEditable = true;
        this.setState({
          teams: {...this.state.teams, [formattedId]: team}
        });
        return;
      }

      let tempId = key !== team.name ? key : null;
      team.name = formattedId; // remove all special char, replace with _
      team.isEditable = false;
      teamsCopy[formattedId] = team;

      if(tempId){
        delete teamsCopy[tempId];
      }
  
      this.updateTeamsDB(team, teamsCopy, false);
    }

    updateTeamsDB = (team, updatedTeamObject, isDelete) =>{
      let url = isDelete ? `${config.baseApiUri}/api/deleteTeam` : `${config.baseApiUri}/api/addTeam`;
      let options = {teamObject: team};

      axios.post(url, options)
        .then(res => {
          this.setState({
            totalTeams: updatedTeamObject.length,
            teams: updatedTeamObject
          });
        }).catch(e=>{
            console.log(e);
        });
    }

    handleTeamCountChange = (params, value) =>{
      let v = parseInt(value,10);
      if(v > 20) return;
      let teamList = Object.keys(this.state.teams);
      let savedTeamsCount = 0;

      _.each(teamList, (key)=>{
        if(key.indexOf('temp') === -1){
          savedTeamsCount++;
        }
      });

      if(v >= savedTeamsCount){
        this.updateTotalTeams(v, this.state.teams);
      }
    }

    totalTeams = () =>{
      return (
        <div>
        <label>Total Teams:</label>
        <Input type="number" onChangeFn={this.handleTeamCountChange} value={this.state.totalTeams} params={{}} />
      </div>
      )
    }

   render() {
     return(
       <div className="add-teams">
          {this.totalTeams()}
          <Teams totalTeams={this.state.totalTeams}
                 teams={this.state.teams}
                 editTeamFn={this.updateTeam}
                 handleChangeFn={this.handleChange}/>
       </div>
     )
   }
 }

export default withRouter(DraftTool);
