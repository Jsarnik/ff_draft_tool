import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Players from './Players';
import Members from './Members';
import DraftOrderBar from './DraftOrderBar';
import * as _ from 'lodash';
import * as espnActions from '../actions/espnActions';
import * as draftActions from '../actions/draftActions';

import { Button } from 'antd';

class DraftLayout extends Component {
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount = () =>{
        this.props.espnActions.getPrivateDraft()
        .then(espnRes => {
            this.props.draftActions.getDraftSettings(espnRes.data.id, espnRes.userModel.id)
            .then(draftData => {})
            .catch(draftErr => {});
        })
        .catch(espnErr => {});
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.user && this.props.draft && this.props.draft !== prevProps.draft){
            console.log(this.props.user)
            if(parseInt(this.props.draft.currentPickTeamId) !== parseInt(this.props.user.team.id)){
                setTimeout(()=>{
                    this.testDraftCurrentTeamPickRecursiveTimeout();
                },1000)
            }
        }
    } 

    getSnakeModel = (draft) => {  
        if(_.isEmpty(draft) || _.isEmpty(this.props.espn.teams)) return null;
        try{
            const rounds = 16;
            let fullOrder = {},
            order = _.map(draft.draftOrder, (_id, i) => {
                return _.find(this.props.espn.teams, {id: _id}) || {};
            }),
            reverseOrder = _.reverse(_.cloneDeep(order));

            for(let i = 1; i <= rounds; i++){
                let r = i % 2 == 0 ? reverseOrder : order;
                fullOrder[i] = {
                    round: i,
                    order: _.map(_.cloneDeep(r), (t, j) => {
                        t.overall = (j+1) + (r.length * (i-1));
                        return t;
                    })
                }
            }
            return fullOrder;
        }catch(ex){
            return null;
        }
    }

    //TODO: TEST TO SEE PICKER CHANGE
    testDraftCurrentTeamPickRecursiveTimeout = () =>{
        let index = this.props.draft.overall-1,
        pickModel = {
            leagueId: this.props.user.leagueId,
            memberId: this.props.user.id,
            playerId: this.props.espn.players[index].id,
            round: this.props.draft.round,
            overall: this.props.draft.overall,
        };
        this.setState({
            loading: true
        })
        this.props.draftActions.setDraftPick(pickModel).then(pickRes=>{
            this.setState({
                loading: false
            })
        }).catch(pickErr=>{
            this.setState({
                loading: false
            })
        });
    }

    render() {
        const isUserPick = !_.isEmpty(this.props.draft) && !_.isEmpty(this.props.user) && parseInt(this.props.draft.currentPickTeamId) === this.props.user.team.id,
        _snakeModel = this.getSnakeModel(_.cloneDeep(this.props.draft)),
        _teamOverallPick = {overall: this.props.draft.overall, teamId: this.props.draft.currentPickTeamId};

        return this.props.espn.members ? (
            <div>
                <DraftOrderBar
                    teamOverallPick={_teamOverallPick}
                    model={_snakeModel}
                >
                </DraftOrderBar>
                <div style={{marginTop:'200px'}}>
                    <Button onClick={this.testDraftCurrentTeamPickRecursiveTimeout}>DRAFT</Button>
                    <Players
                        roster={this.props.espn.players}
                        isUserPick={isUserPick}
                        >
                    </Players>
                    <Members
                        members={this.props.espn.members}>
                    </Members>
                </div>
            </div>
        ) : null;
    }
 }

 function mapStateToProps(state, ownProps){
    return {
      espn: state.espn,
      user: state.user,
      draft: state.draft
    };
  }
  
  function mapDispatchToProps(dispatch){
   return {
     espnActions: bindActionCreators(espnActions, dispatch),
     draftActions: bindActionCreators(draftActions, dispatch)
   };
  }

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(DraftLayout));
