import React, { Component } from 'react';
import * as _ from 'lodash';

class Rounds extends Component {

    constructor(props) {
      super(props);
    }

    handleClick = (team, round, overall) =>{
        let pick = {
            team: team.name,
            roundNo: round,
            overall: overall
        }
        this.props.setCurrentPickFn(pick);
    }
    cell = (_roundNo) =>{
        let teamCount = Object.keys(this.props.teams).length;
        let overAll = 0;
        let isEvenRound = this.isEven(_roundNo);

        if(this.isEven(_roundNo)){
            overAll = (_roundNo * teamCount) + 1;
        }else{
            overAll = (_roundNo-1) * teamCount;
        }

        return _.map(this.props.teams, (team, key)=>{
            if(_roundNo !== 1){
                if(isEvenRound){
                    overAll-=1;
                }else{
                    overAll+=1;
                }
            }else{
                overAll = team.draftPos;
            }

            let _r = `round_${_roundNo}`;
            let pick = team.picks && team.picks[_r] ? team.picks[_r] : null;
            let isSelected = this.props.currentPick && this.props.currentPick.team === team.name && this.props.currentPick.roundNo === _roundNo;
            let pickText = isSelected ? 'PICKING' : 'EMPTY';
            let classes = isSelected ? 'selected' : '';
            let element = null;

            if(pick){
                pick.playerInfo = this.props.players[pick.playerId];
                classes += ` ${pick.playerInfo.pos.replace(/\d/g,'').toLowerCase()}`;
                element = 
                    <div key={key} className={classes + " no-cursor flex-item"} onClick={()=> this.handleClick(team, _roundNo, overAll)}>
                        <div>{pick.playerInfo.name}</div>
                        <div>{pick.playerInfo.pos}</div>
                    </div>
            }else{
                element =
                    <div key={key} className={classes + " selectable flex-item"} onClick={()=> this.handleClick(team, _roundNo, overAll)}>
                         <div>{pickText}</div>
                        <div>{overAll}</div>
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
                <div className="flex-item">
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
            <div>
                {this.round()}
            </div>
        )
   }
 }

export default Rounds;
