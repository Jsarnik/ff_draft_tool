import React, { Component } from 'react';
import ActveTeamRoster from '../components/ActveTeamRoster'
import axios from 'axios';
import * as _ from 'lodash';
import DropDown from '../components/DropDown';

class DraftTool extends Component {

    constructor(props) {
      super(props);
        this.state = {
          teams: [],
          players:[],
          showDrafted: false,
          currentPick: null,
          canDraft:  true,
          filters:{},
          dropdowns:{
            positions: this.getDropDownData(null),
            teams: this.getDropDownData(null)
          },
          overall: 1
        }

        this.teams = [];
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

    componentDidMount = () =>{
      let teamsUrl = 'http://localhost:3001/api/getTeams';
      let playersUrl = 'http://localhost:3001/api/getPlayers';

      axios.get(teamsUrl)
      .then(teamsRes => {
        let teamData = teamsRes.data.data;
        axios.get(playersUrl)
        .then(playersRes =>{
          let playerData = playersRes.data.data;
 
          _.each(playerData, (_p)=>{
            if(_p.pos.toLowerCase().indexOf('dst') > -1){
             let sp = _p.name.split('(');
             let _t = {
               label: _p.name,
               value: sp[1].replace(')', '').trim()
             }
             this.teams.push(_t);
            }
          });

          let dropdowns = {
            positions: this.getDropDownData(this.positions),
            teams: this.getDropDownData(this.teams)
          }

          this.setState({ 
            teams: teamData,
            players: playerData,
            dropdowns: dropdowns
          });
        }).catch(playerErr => {
          console.log(playerErr)
        });
      }).catch(teamsErr => {
        console.log(teamsErr)
      });
    }

    setCurrentPick = (pick) =>{
      let canDraft = !this.state.teams[pick.team].picks || !this.state.teams[pick.team].picks[pick.roundNo];

      this.setState({
        canDraft: canDraft,
        currentPick: pick
      });
    }

    handleDraftClick = (player) =>{
      if(!this.state.currentPick) return;
      player.isDrafted = true;
      player.draftedByUser = this.state.currentPick.team;
      player.roundDrafted = this.state.currentPick.roundNo;
      player.overall = this.state.currentPick.overall

      let teamPicks = this.state.teams[this.state.currentPick.team].picks;
      let _r = `round_${this.state.currentPick.roundNo}`;

      if(!teamPicks){
        teamPicks = {};
      }

      if (teamPicks[_r]){
        return;
      }

      teamPicks[_r] = {
          teamName: player.draftedByUser,
          playerId: player.id,
          roundDraft: player.roundDrafted,
          overall: player.overall
      };

      let options = {
        draftOptions: player
      }

      axios.post('http://localhost:3001/api/draftPlayer', options).then(updatedPlayerRes =>{
        this.setState({
          teams: {...this.state.teams, [this.state.currentPick.team]: {...this.state.teams[this.state.currentPick.team], picks: teamPicks}},
          players: {...this.state.players, [player.id]: player},
          currentPick: null
        }, ()=>{
          
        });
      }).catch(updatePlayerOptionsErr => {
        console.log(updatePlayerOptionsErr)
      });
    }

    handleUndraftClick = (player) =>{
      let draftedByUser = player.draftedByUser;
      let teamPicks = this.state.teams[player.draftedByUser].picks;
      let _r = `round_${player.roundDrafted}`;
      delete teamPicks[_r];

      player.isDrafted = false;
      player.draftedByUser = null;
      player.roundDrafted = null;
      player.overall = null;

      let options = {
        unDraftOptions: player
      }

      axios.post('http://localhost:3001/api/unDraftPlayer', options).then(updatedPlayerRes =>{
        this.setState({
          teams: {...this.state.teams, [draftedByUser]: {...this.state.teams[draftedByUser], picks: teamPicks}},
          players: {...this.state.players, [player.id]: player}
        }, ()=>{
          
        });
      }).catch(updatePlayerOptionsErr => {
        console.log(updatePlayerOptionsErr)
      });
    }

    draftButton = (player) =>{
      if(!player.isDrafted && this.state.currentPick && this.state.teams[this.state.currentPick.team].picks
        && this.state.teams[this.state.currentPick.team].picks[`round_${this.state.currentPick.roundNo}`]){
          return (
            <div className="button disabled">Not Your Pick</div>
          )
        }

      if(!player.isDrafted){
        return (
          <div className="button draft" onClick={() => this.handleDraftClick(player)}>Draft</div>
        )
      }else{
        return (
          <div className="button disabled" onClick={() => this.handleUndraftClick(player)}>Owned (Remove)</div>
        )
      }
    }

    playerHeader = () =>{
      if(this.state.showDrafted){
        return (
          <div className="flex-container">
                <div className="flex-item title half">Rank</div>
                <div className="flex-item title center">Draft</div>
                <div className="flex-item title">Name</div>
                <div className="flex-item title">Pos</div>
                <div className="flex-item title">Team</div>
                <div className="flex-item title">Drafted By</div>
                <div className="flex-item title">Round</div>
                <div className="flex-item title">Overall</div>
            </div>
        )
      }else{
        return (
          <div className="flex-container">
                <div className="flex-item title half">Rank</div>
                <div className="flex-item title center">Draft</div>
                <div className="flex-item title">Name</div>
                <div className="flex-item title">Pos</div>
                <div className="flex-item title">Team</div>
            </div>
        )
      }
      
    }

   playerItem = () =>{
    return _.map(this.state.players, (player, key) => {
     let isDrafted = player.isDrafted;
     let draftClass = isDrafted ? 'drafted' : '';
     let classes = `${draftClass} flex-container player ${player.pos}`;

      if(isDrafted && !this.state.showDrafted){
        return null;
      }

     if(this.state.filters){
        if(this.state.filters.pos){
          if(this.state.filters.pos.toLowerCase() === 'flex' && (player.pos.toLowerCase().indexOf('rb') === -1 && player.pos.toLowerCase().indexOf('wr') === -1 && player.pos.toLowerCase().indexOf('te') === -1)){
            return null;
          }

          if(this.state.filters.pos.toLowerCase() !== 'flex' && player.pos.toLowerCase().indexOf(this.state.filters.pos) === -1){
            return null;
          }
        }
        if(this.state.filters.team && this.state.filters.team.toLowerCase() !== player.team.toLowerCase()){
          return null;
        }
        if(this.state.filters.playerName && player.name.toLowerCase().trim().indexOf(this.state.filters.playerName.toLowerCase().trim()) < 0){
          return null;
        }
      }


      if(this.state.showDrafted){
        return (
          <div className={classes} key={key}>
            <div className="flex-item half">
              {player.rank}
            </div>
            <div className="flex-item center">
              {this.draftButton(player)}
            </div>
            <div className="flex-item">
              {player.name}
            </div>
            <div className="flex-item">
              {player.pos}
            </div>
            <div className="flex-item">
              {player.team}
            </div>
            <div className="flex-item">
              {player.draftedByUser}
            </div>
            <div className="flex-item">
              {player.roundDrafted}
            </div>
            <div className="flex-item">
              {player.overall}
            </div>
          </div>
        )
      }else{
        return (
          <div className={classes} key={key}>
            <div className="flex-item half">
              {player.rank}
            </div>
            <div className="flex-item center">
                {this.draftButton(player)}
            </div>
            <div className="flex-item">
              {player.name}
            </div>
            <div className="flex-item">
              {player.pos}
            </div>
            <div className="flex-item">
              {player.team}
            </div>
          </div>
        )
      }
    });
   }

   handleCheck = () =>{
    this.setState({
      showDrafted: !this.state.showDrafted
    });
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

  filterTeams = (name, val) =>{
    val = val === '-1' ? null : val;

    this.setState({
      filters: {...this.state.filters, [name]: val}
    });
  }

  filterPlayerName = (event) =>{
    this.filterTeams('playerName', event.target.value);
  }

   render() {
     return(
       <div className="draft-tool">        
          <ActveTeamRoster teams = {this.state.teams}   
                          players = {this.state.players}
                          currentPick = {this.state.currentPick}
                          setCurrentPickFn = {this.setCurrentPick}/>

            <div className="player-pickboard">
            <div className="filters">
              <div className="flex-container">
                  <div className="positon flex-item">
                    <label>Positon:</label>
                  </div>
                  <div className="team flex-item">
                    <label>Team:</label>
                  </div>
                  <div className="name flex-item">
                    <label>Player Name:</label>
                  </div>
                  <div className="drafted-players flex-item">
                    <label>Show Drafted Players</label>
                  </div>
              </div>
              <div className="flex-container">
                  <div className="positon flex-item">
                    <DropDown data={this.state.dropdowns.positions} onSelectFn={this.filterTeams} name="pos"/>
                  </div>
                  <div className="team flex-item">
                    <DropDown data={this.state.dropdowns.teams} onSelectFn={this.filterTeams} name="team"/>
                  </div>
                  <div className="name flex-item">
                    <input type="text" value={this.state.filters.playerName} onChange={(e)=> this.filterPlayerName(e)}/>
                  </div>
                  <div className="drafted-players flex-item">
                    <input type="checkbox" value={this.setState.showDrafted} onClick={(e)=>{this.handleCheck()}}/>
                  </div>
              </div>
            </div>

            {this.playerHeader()}
            {this.playerItem()}
            </div>

        </div>
     )
   }
 }

export default DraftTool;
