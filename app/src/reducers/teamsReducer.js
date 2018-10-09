import * as types from '../actions/actionTypes';
import * as _ from 'lodash';

export default function teamsReducer(state = {}, action){
    switch(action.type){
        case types.GET_TEAMS_SUCCESS:
            return action.teams;

        case types.GET_TEAMS_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            });

        case types.CREATE_TEAM_SUCCESS:
            return Object.assign({}, state, {
                [action.team.name]: action.team
            });

        case types.CREATE_TEAM_FAILURE:
            return Object.assign({}, state, {
                [action.team.name]: Object.assign({}, state[action.team.name], {
                    error: action.error
                })
            });

        case types.DELETE_TEAM_SUCCESS:
            let _t = _.cloneDeep(state);
            delete _t[action.teamName];
            return _t;

        case types.DELETE_TEAM_FAILURE:
            return Object.assign({}, state, {
                [action.team.name]: Object.assign({}, state[action.team.name], {
                    error: action.error
                })
            });

        case types.ADD_PICK_SUCCESS:
            return Object.assign({}, state, {
                [action.pick.teamName]: Object.assign({}, state[action.pick.teamName], {
                    picks: Object.assign({}, state[action.pick.teamName].picks, {
                        [action.key]: action.pick
                    })
                })
            });

        case types.DELETE_PICK_SUCCESS:
            let _p = _.cloneDeep(state[action.pick.teamName].picks);
            delete _p[action.key];
            return Object.assign({}, state, {
                [action.pick.teamName]: Object.assign({}, state[action.pick.teamName], {
                    picks: _p
                })
            });

        case types.UPDATE_PICK_FAILURE:
            return state;

        default:
            return state;
    }
}