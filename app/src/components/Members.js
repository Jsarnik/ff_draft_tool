import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as playersActions from '../actions/playersActions';
import * as _ from 'lodash';

const MembersList = (props) =>{
    return _.map(props.members, item => {
        let _player = item.player,
        prev_year_total = _player.stats[0].appliedTotal,
        curr_year_proj = _player.stats[1].appliedTotal;

        return (
            <div key={`${_player.fullName}_${prev_year_total}`} style={{margin: '10px', border: '1px solid'}}>
                <div>Rank: {item.espnRank} </div>
                <div>Name: {_player.fullName} </div>
                <div>defaultPositionId: {_player.defaultPositionId}</div>
                <div>Pos: {_player.defaultPositionName} </div>
                <div>2018 pts: {prev_year_total} </div>
                <div>2019 proj: {curr_year_proj} </div>
            </div>
        )
    })
}

class Members extends Component {
    constructor(props){
        super();
        this.state = {

        }
    }

    componentDidMount = () =>{
     
    }


    render() {
        return 1===1 ? (
            <div>

            </div>
        ) : null;
    }
 }

export default withRouter(Members);
