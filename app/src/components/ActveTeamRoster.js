import React, { Component } from 'react';
import Rounds from '../components/Rounds';
import * as _ from 'lodash';

class ActveTeamRoster extends Component {
  
    teamNames = (orderedTeams) => {
        return _.map(orderedTeams, (team, key)=>{
            let isSelected = this.props.currentPick.team === team.name ? 'selected' : '';
            return (
                  <div key={key} className={isSelected + ' flex-item'}>
                      <div>{team.displayName}</div>
                      <div>({team.owner})</div>
                  </div>
            )
        });
    }

   render() {
     let _players = !_.isEmpty(this.props.players) ? this.props.players : {};
     let _teams = !_.isEmpty(this.props.teams) ? _.orderBy(this.props.teams, ['draftPos', ['asc']]) : {};
     return(
       <div className="team-pickboard">
       <div className="header-row">
            
            <div className="flex-container">
                <div className="flex-item three-quarters">
                    <div>ROUND</div>
                </div>
                {this.teamNames(_teams)}       
            </div>
        </div>
        <Rounds players={_players} 
                orderedTeams={_teams} 
                totalRounds={this.props.totalRounds} 
                currentPick={this.props.currentPick} 
                setCurrentPickFn={this.props.setCurrentPickFn}
                isTimerRunning={this.props.isTimerRunning}/>
       </div>
     )
   }
 }

export default ActveTeamRoster;
