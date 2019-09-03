import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as playersActions from '../actions/playersActions';
import SimpleDropDown from './SimpleDropDown';
import * as _ from 'lodash';
import { Input, Button, Table, Tag } from 'antd';


const PlayerList = (props) =>{
    const columns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank'
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'POS ID',
            dataIndex: 'posId',
            key: 'posId'
          },
          {
            title: 'Pos',
            dataIndex: 'position',
            key: 'position',
            render: text => (
                <Tag className={text.toLowerCase()}>{text}</Tag>
            )
          },
          {
            title: 'Team',
            dataIndex: 'team',
            key: 'team'
          },
          {
            title: '2018',
            dataIndex: '2018',
            key: '2018'
          },
          {
            title: '2019 Proj.',
            dataIndex: '2019',
            key: '2019'
          },
          {
            title: '',
            dataIndex: '',
            key: 'id',
            render: (id) => (
                <Button disabled={!props.isUserPick} onClick={()=>props.handleDraftClick(id)}>Draft</Button>
            )
          }
      ];

      return (
        <Table size='small' pagination={{position: 'both', pageSize: 100}} columns={columns} dataSource={props.rosterOrder} />
      )
}

class Players extends Component {
    constructor(props){
        super();
        this.state = {
            selectedPosition: {},
            selectedTeam: {}
        }
    }

    componentDidMount = () =>{
        this.props.playersActions.getDraftedPlayers(this.props.user.leagueId, this.props.user.id)
        .then(draftedPlayersRes  => {

        }).catch(draftedPlayersErr => {

        });
        this.props.playersActions.getNFLTeams(true);
        this.props.playersActions.getPositions(true);
        
    }

    getOrderedRoster = (rosterData, sortParam, dir) => {
        const data = [];
        switch(sortParam){
            case 'rank':
                _.each(_.orderBy(rosterData, ['espnRank'], [dir]), o => {
                    if(o.player.stats){
                        data.push({
                            key: o.player.id,
                            rank: o.espnRank,
                            name: o.player.fullName,
                            posId: o.player.defaultPositionId,
                            position: o.player.defaultPositionName,
                            team: o.player.teamName,
                            2018: Math.floor(o.player.stats[0].appliedTotal),
                            2019: Math.floor(o.player.stats[1].appliedTotal)
                        });
                    }
                });
                break;
            default:
                break;
        }
        return data;
    } 

    formatPositionDropDown = () => {
        let model = [];
        _.each(this.props.players.positionsListMap, (val, key)=>{
            model.push({
                value: key,
                text: val
            })
        })
        return model;
    }

    formatNFLTeamsDropDown = () => {
        let model = [];
        _.each(this.props.players.nflTeamsListMap, (val, key)=>{
            model.push({
                value: key,
                text: `${val.name} (${val.abbr})`
            })
        })
        return model;
    }

    filterPlayers = () => {
        let _rosterOrder = _.cloneDeep(this.props.roster);

        if(this.state.selectedPosition.val && this.state.selectedPosition.val !== '-1'){
            _rosterOrder = _.filter(_rosterOrder, o => {
                if(this.state.selectedPosition.displayText.toLowerCase() === 'flex'){
                    return o.player.eligibleSlots.indexOf(parseInt(this.state.selectedPosition.val)) !== -1;
                }else{
                    return o.player.defaultPositionId === parseInt(this.state.selectedPosition.val);
                }
            });
        }
        
        if(this.state.selectedTeam.val && this.state.selectedTeam.val !== '-1'){
            _rosterOrder = _.filter(_rosterOrder, o => {
                return o.player.proTeamId === parseInt(this.state.selectedTeam.val);
            });
        }

        if(this.state.playerNameFilterText){
            _rosterOrder = _.filter(_rosterOrder, o => {
                return o.player.fullName.toLowerCase().indexOf(this.state.playerNameFilterText.toLowerCase()) !== -1;
            });
        }

        return _rosterOrder;
    }

    setSelectedTeam = (val) =>{
        this.setState({
            selectedTeam: {
                val,
                displayText: `${this.props.players.nflTeamsListMap[val].name} (${this.props.players.nflTeamsListMap[val].abbr})`
            }
        })
    }

    setSelectedPosition = (val) =>{
        this.setState({
            selectedPosition: {
                val,
                displayText: this.props.players.positionsListMap[val]
            }
        })
    }

    handlePlayerNameFilterChange = (e) => {
        this.setState({
            playerNameFilterText: e.target.value
        })
    }

    handleDraftClick = (playerId) => {
        
    }

    render() {
        const positionDropDown = this.props.players ? this.formatPositionDropDown() : [],
        nflTeamDropDown = this.props.players ? this.formatNFLTeamsDropDown() : [];

        let _rosterOrder = this.filterPlayers();
        _rosterOrder = this.getOrderedRoster(_rosterOrder, 'rank', 'asc');
       
        return _rosterOrder ? (
            <div>
                <SimpleDropDown buttonName={this.state.selectedPosition.displayText || 'All Positions'} selectFn={this.setSelectedPosition} data={positionDropDown}></SimpleDropDown>
                <SimpleDropDown buttonName={this.state.selectedTeam.displayText || 'All Team'} selectFn={this.setSelectedTeam} data={nflTeamDropDown}></SimpleDropDown>
                <Input placeholder="Player Name" onChange={this.handlePlayerNameFilterChange}/>
                <PlayerList rosterOrder={_rosterOrder} handleDraftClick={this.handleDraftClick} isUserPick={this.props.isUserPick} />
            </div>
        ) : null;
    }
 }

 function mapStateToProps(state, ownProps){
    return {
      user: state.user,
      players: state.players
    };
  }
  
  function mapDispatchToProps(dispatch){
   return {
        playersActions: bindActionCreators(playersActions, dispatch)
   };
  }

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Players));
