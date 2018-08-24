import React, { Component } from 'react';
import axios from 'axios';
import Teams from '../components/Teams';

class DraftTool extends Component {

    constructor(props) {
      super(props);
        this.state = {
          totalTeams: 10,
          teams: {},
          isEditTeamCount: false,
        }

        this.tempTeam = {};
    }

    componentDidMount = () => {
      let url = `http://localhost:3001/api/getTeams`;
  
      axios.get(url)
        .then(res => {
          let data = res.data.data;
          let emptyTeams = this.state.totalTeams - Object.keys(data).length;
          if(emptyTeams > 0){
              for(let i = 0; i<emptyTeams; i++){
                  data[`temp_${i}`] = {
                      name: null,
                      owner: null
                  }
              }
          }
          this.setState({ 
            teams: data
          });
        }).catch(e =>{
          console.log(e);
        });
    }

    handleChange = (params, value) =>{
      this.setState({
        teams: {...this.state.teams, [params.prop1]: {...this.state.teams[params.prop1], [params.prop2]: value}}
      });
    }

    updateTeam = (key, team, isEdit) =>{
      if(!team.displayName || !team.owner) return;

      let formattedId = team.displayName.replace(/[^A-Z0-9]/ig, "_");
      
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
      let teamsCopy = this.state.teams;
      teamsCopy[formattedId] = team;

      if(tempId){
        delete teamsCopy[tempId];
      }

      let url = `http://localhost:3001/api/addTeam`;
      let options = {teamObject: team};
  
      axios.post(url, options)
        .then(res => {
          this.setState({
            teams: teamsCopy
          });
        }).catch(e=>{
            console.log(e);
        });
    }

    handleTeamCountChange = (event) =>{
      this.setState({
        totalTeams: event.target.value
      });
    }

    totalTeams = () =>{
      return (
        <div>
        <label>Total Teams:</label>
        <input type="number" value={this.state.totalTeams} onChange={(e)=>{this.handleTeamCountChange(e)}}/>
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

export default DraftTool;
