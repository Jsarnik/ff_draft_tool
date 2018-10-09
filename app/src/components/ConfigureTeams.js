import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as teamsActions from '../actions/teamsActions';
import * as dataActions from '../actions/dataActions';
import Teams from '../components/Teams';
import Input from '../components/Input';
import * as _ from 'lodash';

class DraftTool extends Component {

    constructor(props) {
      super(props);
        if(!props.match.params.leagueName){
          props.history.push('/');
        }

        this.leagueName = props.match.params.leagueName;
        
        this.state = {
          tempTeamsList: {},
          totalTeams: 10,
          isEditTeamCount: false,
          isEditMode: false
        }
    }

    componentDidMount = () =>{
      if(!this.props.routes.leagueName){
        this.props.onEnterRoute(this.props.match);
      }

      if(_.isEmpty(this.props.teams)){
        this.props.teamsActions.getTeams(this.leagueName);
      }
      
      if(_.isEmpty(this.state.tempTeamsList)){
        this.updateTotalTeams(this.state.totalTeams, _.cloneDeep(this.props.teams));
      }
    }

    componentDidUpdate = (prevProps) => {
      if(!this.props.routes.leagueName){
        this.props.history.push('/');
      }

      if(!_.isEmpty(this.props.league) && this.props.league.removedDate !== null){
        this.props.history.push('/data');
      }

      if(this.props.teams !== prevProps.teams){
        this.updateTotalTeams(this.state.totalTeams, _.cloneDeep(this.props.teams));
      }

      if(this.props.data.dialogOptions.result !== null){
        if(this.props.data.dialogOptions.result === true && this.props.data.dialogOptions.execFn){
          this.props.data.dialogOptions.execFn();
        }
        this.props.dataActions.resetConfirmDialog();
      }
    }

    updateTotalTeams = (totalTeams, currentTeams) =>{
      let emptyTeams = totalTeams - Object.keys(currentTeams).length;
      let draftPos = totalTeams - emptyTeams + 1;
      let updated = false;

      if(emptyTeams >= 0){
          updated = true;
          for(let i = 0; i<emptyTeams; i++){
            let keyVal = recursiveKeyCheck('temp', i);
            currentTeams[keyVal] = {
                displayName: null,
                name: null,
                owner: null,
                draftPos: draftPos
            }
            draftPos++;
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
          tempTeamsList: currentTeams
        });
      }

      function recursiveKeyCheck(s, i){
        let key = `${s}_${i}`;
        i++;
        return !currentTeams[key] ? key : recursiveKeyCheck(s, i);
      }
    }

    handleChange = (params, value) =>{
      let clone = _.cloneDeep(this.state.tempTeamsList[params.prop1]);
      clone.editedRollBack = !clone.editedRollBack ? this.state.tempTeamsList[params.prop1] : clone.editedRollBack;
      clone[params.prop2] = value;

      this.setState({
        tempTeamsList: {...this.state.tempTeamsList,
            [params.prop1]: clone
        }
      });
    }

    handleClick = (isCancel) =>{
      let _tempTeams = {...this.state.tempTeamsList};

      _.each(_tempTeams, (team, key)=>{
        if(team.editedRollBack){
          if(isCancel){
            team = team.editedRollBack;
          }else{
            delete team.editedRollBack;
          }
          this.updateTeam(key, team, false);
        }
      });

      this.setState({
        isEditMode: false
      })
    }

    editTeam = (key, team, isDelete) =>{
      if(isDelete){
        return this.props.dataActions.setConfirmDialogOptions(`Are you sure you want to remove ${team.name} from the roster?`, ()=>{this.updateTeam(key, team, isDelete)});
      }

      this.updateTeam(key, team, isDelete);
    }

    updateTeam = (key, team, isDelete) =>{
      if((!team.displayName || !team.owner) && !isDelete) return;

      team.name = team.displayName.replace(/[^A-Z0-9]/ig, "_");
      team.league = this.leagueName;
      let isUpdate = this.props.teams.hasOwnProperty(key);
      let keyChangeRequiresDelete = (key.indexOf('temp_') === -1 && key !== team.name) ? key : null;

      this.updateTeamsDB(team, isDelete, isUpdate, keyChangeRequiresDelete);
    }

    updateTeamsDB = (team, isDelete, isUpdate, keyChangeRequiresDelete) =>{
      if(isDelete){
        this.props.teamsActions.deleteTeam(team).then((res)=>{});
        return;
      }

      if(isUpdate){
        this.props.teamsActions.updateTeam(team, keyChangeRequiresDelete).then((res)=>{});
        return;
      }

      this.props.teamsActions.createTeam(team).then((res)=>{});
    }

    handleTeamCountChange = (params, value) =>{
      let v = parseInt(value,10);
      if(v > 20) return;
      let teamList = Object.keys(this.state.tempTeamsList);
      let savedTeamsCount = 0;

      _.each(teamList, (key)=>{
        if(key.indexOf('temp') === -1){
          savedTeamsCount++;
        }
      });

      if(v >= savedTeamsCount){
        this.updateTotalTeams(v, this.state.tempTeamsList);
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

    toggleEditMode = (val) =>{
      this.setState({
        isEditMode: val
      })
    }

    buttonLayout = () => {
      if(this.state.isEditMode){
        return (
          <div className="flex-item">
            <div className="flex-container">
              <div className="flex-item">
                <div className="button delete" onClick={()=> this.handleClick(true)}>Cancel</div>
              </div>
              <div className="flex-item">
                <div className="button" onClick={()=> this.handleClick()}>Save</div>
              </div>
            </div>
          </div>
        )
      }else{
        return (
          <div className="flex-item left">
              <div className="button edit" onClick={()=> this.toggleEditMode(true)}>Edit Teams</div>
          </div>
        )
      }
    }

   render() {
     return(
       <div className="add-teams">
          {this.totalTeams()}
          <div className="flex-container manage-teams-controls">
            {this.buttonLayout()}
          </div>
          <Teams totalTeams={this.state.totalTeams}
                 teams={this.state.tempTeamsList}
                 editTeamFn={this.editTeam}
                 handleChangeFn={this.handleChange}
                 isEditMode={this.state.isEditMode}/>
       </div>
     )
   }
 }

 function mapStateToProps(state, ownProps){
  return {
    league: state.league,
    teams: state.teams,
    routes: state.routes,
    data: state.data
  };
}

function mapDispatchToProps(dispatch){
 return {
   teamsActions: bindActionCreators(teamsActions, dispatch),
   dataActions: bindActionCreators(dataActions, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(DraftTool));
