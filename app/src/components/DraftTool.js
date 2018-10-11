import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as teamsActions from '../actions/teamsActions';
import * as playersActions from '../actions/playersActions';
import * as dataActions from '../actions/dataActions';
import ActveTeamRoster from './ActveTeamRoster';
import * as _ from 'lodash';
import Roster from './Roster';
import PlayersList from './PlayersList';
import DraftOrderScrollingBar from './DraftOrderScrollingBar';
import Timer from './Timer';
import DropDown from './DropDown';

class DraftTool extends Component {

    constructor(props) {
      super(props);
        if(!props.match.params.leagueName){
          props.history.push('/');
        }

        this.leagueName = props.match.params.leagueName;
        this.totalRounds = 12;
        this.pickAllowedTime = 2;
        
        this.state = {
          clockOptions:{
            pickAllowedTime: this.pickAllowedTime,
            remainingPickTimeSec: this.pickAllowedTime,
            isTimerRunning: false,
            isTimerReset: false
          },
          snakeOrder: {},
          showDrafted: false,
          currentPick: {team: null, roster: null},
          canDraft: true,
          dropdowns:{
            positions: this.getDropDownData(null),
            teams: this.getDropDownData(null),
            members: this.getDropDownData(null)
          },
          overall: 1,
          rosterTemplate: {
            qb: null,
            rb1: null,
            rb2: null,
            wr1: null,
            wr2: null,
            te: null,
            flex: null,
            dst: null,
            k: null,
            bench1: null,
            bench2: null,
            bench3: null,
            bench4: null,
            bench5: null,
            bench6: null,
            bench7: null
          }
        }

        this.teamNamesList = null;
        this.positions = [
          {
            label: 'QB',
            value: 'qb'
          },
          {
            label: 'RB',
            value: 'rb'
          },
          {
            label: 'TE',
            value: 'te'
          },
          {
            label: 'WR',
            value: 'wr'
          },{
            label: 'Flex',
            value: 'flex'
          },{
            label: 'K',
            value: 'k'
          },{
            label: 'DST',
            value: 'dst'
          }
        ]
    }

    componentDidMount = () => {
      if(!this.props.routes.leagueName){
        this.props.onEnterRoute(this.props.match);
      }

      if(_.isEmpty(this.props.teams)){
        this.props.teamsActions.getTeams(this.leagueName).then(teamsResponse => {
          if(!teamsResponse.error){
            this.createSnakeOrder(_.orderBy(teamsResponse, ['draftPos'], ['asc']));
          }
        }).catch(teamsErr => {

        });
      }

      if(_.isEmpty(this.props.players)){
        this.props.playersActions.getPlayers(this.leagueName);
      }

      if(this.teamNamesList){
        this.setDropDowns('teams', this.teamNamesList);
      }

      if(this.membersList){
        this.setDropDowns('members', this.membersList);
      }

      this.setDropDowns('positions', this.positions);
    }

    componentDidUpdate = (prevProps) => {
      if(!this.props.routes.leagueName){
        this.props.history.push('/');
      }

      if(!_.isEmpty(this.props.league) && this.props.league.removedDate !== null){
        this.props.history.push(`/${this.props.league.league}/data`);
      }

      if(this.props.data.dialogOptions.result !== null){
        if(this.props.data.dialogOptions.result === true && this.props.data.dialogOptions.execFn){
          this.props.data.dialogOptions.execFn();
        }
        this.props.dataActions.resetConfirmDialog();
      }

      if(!_.isEmpty(this.props.players) && !_.isEmpty(this.props.teams) && !this.state.currentPick.roster){
        let firstPick = {
          team: null,
          roundNo: 1,
          overall: 1,
          isDrafted: false
        };
        _.each(this.props.teams, (team)=>{
          if(team.draftPos === 1){
            firstPick.isDrafted = team.picks['round_1'] ? true : false;
            firstPick.team = team.name;
          }
        });
        this.setCurrentPick(firstPick, true);
      }

      if(!_.isEmpty(this.props.players) && !this.teamNamesList){
        this.teamNamesList = [];
        _.each(this.props.players, (_p)=>{
          if(_p.pos.toLowerCase().indexOf('dst') > -1){
            let sp = _p.name.split('(');
            let _t = {
              label: _p.name,
              value: sp[1].replace(')', '').trim()
            }
            this.teamNamesList.push(_t);
          }
        });        
        this.setDropDowns('teams', this.teamNamesList);
      }

      if(!_.isEmpty(this.props.teams) && !this.membersList){
        this.membersList = [];
        _.each(Object.keys(this.props.teams), member => {
          this.membersList.push({label: member, value: member});
        });
        this.setDropDowns('members', this.membersList);
      }
    }

    createSnakeOrder = (orderedTeams) =>{
      let totalTeams = orderedTeams.length;
      let totalPicks = totalTeams * this.totalRounds;
      let snakeOrder = {};
      let orderIndex = 0;
      let isIncrease = true;
      let round = 1;
      
      for(let i = 0; i < totalPicks; i++){

        //Signifies a new round
        if(orderIndex === totalTeams || orderIndex === -1){
          isIncrease = !isIncrease;
          orderIndex = isIncrease ? 0 : totalTeams-1;
          round++;
        }

        let _overall = i+1;
        let key = `overall_${_overall}`;
        let team = {...orderedTeams[orderIndex]};
        team.overall = _overall;
        team.colorIndex = orderIndex+1;
        team.roundNo = round;
        team.hasDrafted = team.picks[`round_${round}`] ? true : false;
        delete team.picks;
        snakeOrder[key] = team;

        if(isIncrease){
          orderIndex++
        }else{
          orderIndex--
        }
      }

      this.setState({
        snakeOrder: snakeOrder
      });
    }

    setDropDowns = (key, data) => {
      this.setState({
        dropdowns: {...this.state.dropdowns, [key]: this.getDropDownData(data)}
      });
    }

    tryGoToNextEligiblePick = () =>{
      if(!this.state.currentPick.canDraft){
        this.setCurrentPick(this.recursivelyFindNextPick(this.state.currentPick.overall));
      }
    }

    setCurrentPick = (pick, updateRoster) =>{
      if(!pick.team) return;
      pick.roster = !updateRoster && this.state.currentPick.team === pick.team? this.state.currentPick.roster : this.updateTeamRoster(this.props.teams[pick.team].picks, this.props.players);
      pick.canDraft = !pick.isDrafted;

      this.setState({
        currentPick: pick
      });
    }

    handleDraftClick = (player) =>{
      let _player = !player ? this.autoDraftPlayer()  : _.cloneDeep(player);
      let _r = `round_${this.state.currentPick.roundNo}`;

      if(!this.state.currentPick.team || 
        (this.props.teams[this.state.currentPick.team].picks && 
          this.props.teams[this.state.currentPick.team].picks[_r])){
          return;
      }

      _player.isDrafted = true;
      _player.draftedByUser = this.state.currentPick.team;
      _player.roundDrafted = this.state.currentPick.roundNo;
      _player.overall = this.state.currentPick.overall;

      let newPick = {
          roundKey: _r,
          pick: {
            teamName: _player.draftedByUser,
            playerId: _player.id,
            roundDraft: _player.roundDrafted,
            overall: _player.overall
          }
      };

      this.props.playersActions.draftPlayer(_player, newPick).then(res => {
        if (res.error) return console.log(res.error);
        this.props.teamsActions.updatePick(newPick);
        this.updateTimer(this.state.clockOptions.isTimerRunning, this.state.clockOptions.pickAllowedTime, true);
        this.updateSnakeOrder(newPick.pick.overall, true);
        this.setCurrentPick(this.recursivelyFindNextPick(newPick.pick.overall), true);
      });
    }

    updateSnakeOrder = (overall, _hasDrafted) =>{
      this.setState({
        snakeOrder: {...this.state.snakeOrder, [`overall_${overall}`]: {...this.state.snakeOrder[`overall_${overall}`], hasDrafted: _hasDrafted}}
      })
    }
    
    recursivelyFindNextPick = (overall) =>{
      let prop = `overall_${overall}`;
      if(!this.state.snakeOrder[prop].hasDrafted){
        return {
          team: this.state.snakeOrder[`overall_${overall}`].name,
          isDrafted: false,
          overall: overall,
          roundNo: this.state.snakeOrder[`overall_${overall}`].roundNo,
          roster: null
        };
      }else{
        overall++;
        return this.recursivelyFindNextPick(overall);
      }
    }

    undraftPlayer = (player) =>{
      let _player = _.cloneDeep(player);
      let draftedByUser = _player.draftedByUser;
      let _r = `round_${_player.roundDrafted}`;

      _player.isDrafted = false;
      _player.draftedByUser = null;
      _player.roundDrafted = null;
      _player.overall = null;

      this.props.playersActions.unDraftPlayer(_player).then(res => {
        let pick = {
          roundKey: _r,
          pick: {
            teamName: draftedByUser
          }
        };
        this.props.teamsActions.updatePick(pick, true);
        this.updateSnakeOrder(player.overall, false);
        this.setCurrentPick({...this.state.currentPick, isDrafted: false}, true);
      }).catch(err =>{
        console.log(err);
      });
    }

    handleUndraftClick = (player) =>{
      this.props.dataActions.setConfirmDialogOptions(`Are you sure you want to remove ${player.draftedByUser}'s round ${player.roundDrafted} pick of ${player.name}?`, ()=>this.undraftPlayer(player));
    }

   getDropDownData = (data) =>{
    let model = [{
        value: '-1',
        label: '- Select -'
    }];

    _.each(data, (option) =>{
        let o = {
            value: option.value,
            label: option.label
        }
        model.push(o);
    });

    return model;
  }

  updateTeamRoster = (picks, _players) =>{
    let template = _.cloneDeep(this.state.rosterTemplate);
    _.each(picks, (pick, k)=>{
      let filled = {..._players[pick.playerId]};
      let f_pos = filled.pos.toLowerCase().replace(/[0-9]/g, '');  
      _.each(template, (temp, key)=>{
        let replacedKey = key.replace(/[0-9]/g, '');
        if(!filled.isFilled){
          if(replacedKey === f_pos && !temp && !filled.isFilled){
            filled.isFilled = true;
            template[key] = filled;
          }
          else if(replacedKey === 'flex' && !temp && (f_pos === 'wr' || f_pos === 'rb' || f_pos === 'te') && !filled.isFilled){
            filled.isFilled = true;
            template[key] = filled;
          }
          else if(replacedKey === 'bench' && !temp && !filled.isFilled){
            filled.isFilled = true;
            template[key] = filled;
          }
        }
      });
    });

    return template;
  }
  

  autoDraftPlayer = () =>{
    let _filtered = _.filter(this.props.players, ['isDrafted', false]);
    let _sorted = _.orderBy(_filtered, ['rank'], ['asc']);

    return _sorted[0];
  }

  updateTimer = (isRunning, timeLeft, isReset) =>{    
    this.setState({
      clockOptions: {...this.state.clockOptions, remainingPickTimeSec: timeLeft, isTimerRunning: isRunning, isTimerReset: isReset}
    });
  }

  currentPick = () => {
    if(this.state.currentPick){
       return(
         <div className="current-pick flex-container">
           <div className="flex-item"><span>ROUND: </span>{this.state.currentPick.roundNo}</div>
           <div className="flex-item"><span>PICK: </span>{this.state.currentPick.team}</div>
           <Timer currentPick={this.state.currentPick}
                  clockOptions={this.state.clockOptions}
                  autoDraftPlayerFn={this.handleDraftClick} 
                  updateTimerFn={this.updateTimer}
                  tryGoToNextEligiblePick={this.tryGoToNextEligiblePick}/>
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

  selectRoster = (name, val) =>{
    this.setState({
      selectedRoster: { ...this.state.selectedRoster,
        team: val,
        roster: this.updateTeamRoster(this.props.teams[val].picks, this.props.players)
      }
    });
  }

  render() {
    let _players = _.cloneDeep(this.props.players);
    let _teams = _.cloneDeep(this.props.teams);
    let _playerInfo = this.state.currentPick.team && 
      _teams[this.state.currentPick.team].picks[`round_${this.state.currentPick.roundNo}`] ?
      _players[_teams[this.state.currentPick.team].picks[`round_${this.state.currentPick.roundNo}`].playerId] : null;

    return(
      <div>
      {this.currentPick()}

      <DraftOrderScrollingBar snakeOrder={this.state.snakeOrder}
                                  currentPick = {this.state.currentPick}/>

        <div className="draft-tool">        
          <ActveTeamRoster  teams = {_teams}
                            players = {_players}
                            totalRounds={this.totalRounds}
                            currentPick = {this.state.currentPick}
                            setCurrentPickFn = {this.setCurrentPick}
                            isTimerRunning={this.state.clockOptions.isTimerRunning}/>

          <div className="current-roster">
            <div>Current Pick: </div>
            <Roster currentPick={this.state.currentPick} />
          </div>
          
          <PlayersList players={_players} 
                       playerInfo={_playerInfo} 
                       handleUndraftClickFn={this.handleUndraftClick} 
                       handleDraftClickFn={this.handleDraftClick}
                       showDrafted={this.state.showDrafted} 
                       dropdowns={this.state.dropdowns}/>

          <div className="selected-roster">
            <div><DropDown data={this.state.dropdowns.members} onSelectFn={this.selectRoster} name="members"/></div>
            <Roster currentPick={this.state.selectedRoster || this.state.currentPick} />
          </div>

          
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
  return {
    league: state.league,
    teams: state.teams,
    players: state.players,
    routes: state.routes,
    data: state.data
  };
}

function mapDispatchToProps(dispatch){
 return {
   teamsActions: bindActionCreators(teamsActions, dispatch),
   playersActions: bindActionCreators(playersActions, dispatch),
   dataActions: bindActionCreators(dataActions, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(DraftTool));
