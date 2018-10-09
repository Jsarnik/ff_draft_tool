import React, { Component } from 'react';
import * as _ from 'lodash';
import Input from '../components/Input';

class Teams extends Component {
    handleClick = (key, team, isDelete) =>{
        this.props.editTeamFn(key, team, isDelete);
    }

    enterTeams = () => {
      _.each(this.props.teams, (team, key)=>{team.key = key});
      let _orderedTeams = _.orderBy(this.props.teams, ['draftPos'], ['asc']);

      return _.map(_orderedTeams, (team, index)=>{
        let _placeholder = !team.name ? `ENTER TEAM ${index+1}` : '';
        return (
          <div className="flex-container" key={team.key} draftpos={parseInt(team.draftPos)}>
            <div className="flex-item">
                <Input type="text" placeholder={_placeholder} isDisabled={!this.props.isEditMode} onChangeFn={this.props.handleChangeFn} value={team.displayName} params={{prop1: team.key, prop2:"displayName"}} />
              </div>
              <div className="flex-item">
                <Input type="text" placeholder={_placeholder} isDisabled={!this.props.isEditMode} onChangeFn={this.props.handleChangeFn} value={team.owner} params={{prop1: team.key, prop2:"owner"}} />
              </div>
              <div className="flex-item">
                <Input type="number" placeholder={_placeholder} isDisabled={!this.props.isEditMode} onChangeFn={this.props.handleChangeFn} value={team.draftPos} params={{prop1: team.key, prop2:"draftPos"}} />
              </div>
              <div className="flex-item">
                {this.showHideRemoveButton(team.key, team)}
            </div>
          </div>
        )
      });
    };

    showHideRemoveButton = (key, team) =>{
      if(!team.name){
        return (
          null
        )
      }else{
        return (
          <div className="button edit" onClick={()=> this.handleClick(key, team, true)}>Remove</div>
        )
      }
    }

   render() {
     return(
         <div>
            <div className="flex-container">
                <div className="flex-item title">
                    Name
                </div>
                <div className="flex-item title">
                    Owner
                </div>
                <div className="flex-item title">
                    Position
                </div>
                <div className="flex-item title">
                    &nbsp;
                </div>
            </div>
            {_.orderBy(this.enterTeams(), ['draftpos'], ['asc'])}
         </div>
     )
   }
 }

export default Teams;
