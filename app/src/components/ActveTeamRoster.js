import React, { Component } from 'react';
import Rounds from '../components/Rounds';
import * as _ from 'lodash';

class ActveTeamRoster extends Component {

    constructor(props) {
      super(props);
      this.totalRounds = 12;
    }

    currentPick = () =>{
        if(this.props.currentPick){
           return(
             <div className="current-pick flex-container">
               <div className="flex-item"><span>ROUND: </span>{this.props.currentPick.roundNo}</div>
               <div className="flex-item"><span>PICK: </span>{this.props.currentPick.team}</div>
             </div>
           )
         }else{
            return(
                <div className="current-pick flex-container">
                  <div className="flex-item"><span>ROUND: </span>None Selected</div>
                  <div className="flex-item"><span>PICK: </span>None Selected</div>
                </div>
              )
         }
      }

    teamNames = () =>{
        return _.map(this.props.teams, (team, key)=>{
            let isSelected = this.props.currentPick === team ? 'selected' : '';
            return (
                  <div key={key} className={isSelected + ' flex-item'}>
                      <a href={`/roster/${team.name}`}>
                        {team.displayName} ({team.owner})
                      </a>
                  </div>
            )
        });
    }

   render() {
     return(
       <div className="team-pickboard">
       <div className="header-row">
            {this.currentPick()}
            <div className="flex-container">
                <div className="flex-item">
                    <div>ROUND</div>
                </div>
                {this.teamNames()}       
            </div>
        </div>
        <Rounds players={this.props.players} teams={this.props.teams} totalRounds={this.totalRounds} currentPick={this.props.currentPick} setCurrentPickFn={this.props.setCurrentPickFn}/>
       </div>
     )
   }
 }

export default ActveTeamRoster;
