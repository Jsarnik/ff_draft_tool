import React, { Component } from 'react';
import * as _ from 'lodash';
import Input from '../components/Input';

class Teams extends Component {
  constructor(props) {
    super(props);
   
  }
    handleClick = (key, team, isEdit) =>{
        this.props.editTeamFn(key, team, isEdit);
    }

    enterTeams = () => {
      return _.map(this.props.teams, (team, key)=>{
        if(!team.name || team.isEditable){     
          return (
            <div className="flex-container" key={key}>
            <div className="flex-item">
                <Input type="text" onChangeFn={this.props.handleChangeFn} value={team.displayName} params={{prop1: key, prop2:"displayName"}} />
              </div>
              <div className="flex-item">
                <Input type="text" onChangeFn={this.props.handleChangeFn} value={team.owner} params={{prop1: key, prop2:"owner"}} />
              </div>
              <div className="flex-item">
                <Input type="number" onChangeFn={this.props.handleChangeFn} value={team.draftPos} params={{prop1: key, prop2:"draftPos"}} />
              </div>
              <div className="flex-item">
                <div className="button" onClick={()=> this.handleClick(key, team, false)}>Save</div>
              </div>
            </div>
          )
        }else{
          return (
            <div className="flex-container">
              <div className="flex-item">
                <div>{team.displayName}</div>
              </div>
              <div className="flex-item">
                  <div>{team.owner}</div>
              </div>
              <div className="flex-item">
                  <div>{team.draftPos}</div>
              </div>
              <div className="flex-item">
                  <div className="button edit" onClick={()=> this.handleClick(key, team, true)}>Edit</div>
              </div>
            </div>
          )
          }
      });
    };

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
            {this.enterTeams()}
         </div>
     )
   }
 }

export default Teams;
