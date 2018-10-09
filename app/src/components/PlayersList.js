import React, { Component } from 'react';
import * as _ from 'lodash';
import DropDown from './DropDown';

class PlayersList extends Component {
    constructor(props) {
        super(props);

        this.playerColumnsModel = {
          rank: {
            displayVal: 'Rank',
            alwaysVisible: true,
            classType: 'half'
          },
          draft: {
            displayVal: 'Draft',
            alwaysVisible: true,
            classType: 'half'
          },
          name: {
            displayVal: 'Name',
            alwaysVisible: true
          },
          pos: {
            displayVal: 'Pos',
            alwaysVisible: true,
            classType: 'half'
          },
          team: {
            displayVal: 'Team',
            alwaysVisible: true
          },
          bye: {
            displayVal: 'Bye',
            alwaysVisible: true,
            classType: 'half'
          },
          draftedByUser: {
            displayVal: 'Drafted By',
            alwaysVisible: false
          },
          roundDrafted: {
            displayVal: 'Round',
            alwaysVisible: false,
            classType: 'half'
          },
          overall: {
            displayVal: 'Overall',
            alwaysVisible: false,
            classType: 'half'
          }
      }
         
        this.state = {
            orderBy: {
              prop: 'rank',
              isAsc: true
            },
            showDrafted: false,
            filters:{}
        }
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

    handleShowDraftedCheck = (e) =>{
        this.setState({
          showDrafted: !this.state.showDrafted
        });
    }

    handleUndraftClick = (player) =>{
        if(this.props.handleUndraftClickFn){
            this.props.handleUndraftClickFn(player);
        }  
    }

    handleDraftClick = (player) => {
        if(this.props.handleDraftClickFn){
            this.props.handleDraftClickFn(player);
        }  
    }

    handleOrderByClick = (prop) => {
      let _isAsc = this.state.orderBy.prop === prop ? !this.state.orderBy.isAsc : true;
      this.setState({
        orderBy:{...this.state.orderBy, prop: prop, isAsc: _isAsc}
      })
    }

    playerHeader = () =>{
        return _.map(this.playerColumnsModel, (item, key)=>{
            if (item.alwaysVisible || (!item.alwaysVisible && this.state.showDrafted)){
              return (
                <div className={"flex-item title " + item.classType} onClick={()=>{this.handleOrderByClick(key)}}>
                    <label>{item.displayVal}</label>
                    {this.state.orderBy.prop === key ? <div className={this.state.orderBy.isAsc ? 'asc' : 'desc'}></div> : null}
                </div>
              )
            }
        });
      }

      draftButton = (player) =>{
        if(!player.isDrafted){
          return (
            <div className="button draft" onClick={() => this.handleDraftClick(player)}>Draft</div>
          )
        }else{
          return (
            <div className="button disabled">Drafted</div>
          )
        }
      }


      playerRow = (_player) =>{
        return _.map(this.playerColumnsModel, (column, key)=>{
          if(column.alwaysVisible || (!column.alwaysVisible && this.state.showDrafted)){
            return (
              <div className={"flex-item " + column.classType}>
                {key === 'draft' ? this.draftButton(_player) : _player[key]}
              </div>
            )
          }
        });
      }

    playerItem = (_players) =>{
        let _direction = this.state.orderBy.isAsc ? 'asc' : 'desc';
        let _orderedList = _.orderBy(_players, [this.state.orderBy.prop], [_direction]);

        return _.map(_orderedList, (player, index) => {
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

          return(
            <div className={classes} key={index}>
              {this.playerRow(player)}
            </div>
          )
        });
       }

    draftedPlayerItem = (playerInfo) =>{
        return (
            <div>
            <div className="flex-container">
                <div className="flex-item">Name</div>
                <div className="flex-item">Position</div>
                <div className="flex-item">Team</div>
                <div className="flex-item">Drafted By</div>
                <div className="flex-item">Round</div>
                <div className="flex-item">Overall</div>
                <div className="flex-item">Undo</div>
            </div>
            <div className="flex-container">
                <div className="flex-item">{playerInfo.name}</div>
                <div className="flex-item">{playerInfo.pos}</div>
                <div className="flex-item">{playerInfo.team}</div>
                <div className="flex-item">{playerInfo.draftedByUser}</div>
                <div className="flex-item">{playerInfo.roundDrafted}</div>
                <div className="flex-item">{playerInfo.overall}</div>
                <div className="flex-item">
                  <div className="button remove" onClick={() => this.handleUndraftClick(playerInfo)}>Undo</div>
                </div>
            </div>
            </div>
        )
    }

    playerList = () => {
        if(this.props.playerInfo){
            return (
              <div>
                  {this.draftedPlayerItem(this.props.playerInfo)}
              </div>
            )
          }else{
            return (
              <div>
                <div className="flex-container player-list-headers">
                  {this.playerHeader()}
                </div>
                {this.playerItem(this.props.players)}
              </div>
            )
          }
    }

   render() {
        return (
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
                        <DropDown data={this.props.dropdowns.positions} onSelectFn={this.filterTeams} name="pos"/>
                    </div>
                    <div className="team flex-item">
                        <DropDown data={this.props.dropdowns.teams} onSelectFn={this.filterTeams} name="team"/>
                    </div>
                    <div className="name flex-item">
                        <input type="text" value={this.state.filters.playerName} onChange={(e)=> this.filterPlayerName(e)}/>
                    </div>
                    <div className="drafted-players flex-item">
                        <input type="checkbox" value={this.state.showDrafted} onClick={(e)=>{this.handleShowDraftedCheck(e)}}/>
                    </div>
                </div>
                </div>

                {this.playerList()}
        </div>
    )
   }
 }

export default PlayersList;
