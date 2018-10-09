import React, { Component } from 'react';
import * as _ from 'lodash';

class Rounds extends Component {

    handleClick = (team, round, _overAll, isDrafted) =>{
        if(this.props.isTimerRunning) return;
        let pick = {
            team: team.name,
            roundNo: round,
            overall: _overAll,
            isDrafted: isDrafted
        }
        this.props.setCurrentPickFn(pick);
    }

    cell = (_roundNo) =>{
        let teamCount = Object.keys(this.props.orderedTeams).length;
        let _overAll = 0;
        let isEvenRound = this.isEven(_roundNo);

        if(this.isEven(_roundNo)){
            _overAll = (_roundNo * teamCount) + 1;
        }else{
            _overAll = (_roundNo-1) * teamCount;
        }

        return _.map(this.props.orderedTeams, (team, key)=>{
            if(_roundNo !== 1){
                if(isEvenRound){
                    _overAll-=1;
                }else{
                    _overAll+=1;
                }
            }else{
                _overAll = team.draftPos;
            }

            let _r = `round_${_roundNo}`;
            let pick = team.picks && team.picks[_r] ? team.picks[_r] : null;
            let isSelected = this.props.currentPick && this.props.currentPick.team === team.name && this.props.currentPick.roundNo === _roundNo;
            let pickText = isSelected ? 'PICKING' : 'EMPTY';
            let classes = isSelected ? 'selected' : '';
            let element = null;

            if(pick && this.props.players[pick.playerId]){
                pick.playerInfo = this.props.players[pick.playerId];
                classes += ` ${pick.playerInfo.pos.replace(/\d/g,'').toLowerCase()}`;
                element = 
                    <div key={key} className={classes + " no-cursor flex-item"} onClick={(e)=> this.handleClick(team, _roundNo, team.picks[_r].overall, true, e)}>
                        <div>{pick.playerInfo.name}</div>
                        <div>{pick.playerInfo.pos}</div>
                    </div>
            }else{
                team.picks[_r] = {overall:_overAll};
                element =
                    <div key={key} className={classes + " selectable flex-item"} onClick={(e)=> this.handleClick(team, _roundNo, team.picks[_r].overall, false)}>
                        <div>{pickText}</div>
                        <div>{_overAll}</div>
                    </div>
            }

            return (
                element
            )
        });
    }

    isEven = (num) => {
        return num % 2 === 0;
    }

    row = (round) => {
        return (
            <div key={round} className="flex-container">
                <div className="flex-item three-quarters round-number">
                    <div>{round}</div>
                    <div>&nbsp;</div>
                </div>
                {this.cell(round)}
            </div>
        )
    }

    round = () =>{
        let rows = [];
        for(let i = 1; i <= this.props.totalRounds; i++){
            rows.push(this.row(i));
        };
        return rows;
    }

   render() {
        return(
            <div className="draft-cells-container">
                {this.round()}
            </div>
        )
   }
 }

export default Rounds;
