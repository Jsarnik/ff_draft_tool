import * as types from '../actions/actionTypes';

export default function leagueReducer(state = {}, action){
    switch(action.type){
        case types.GET_LEAGUE_SUCCESS:
            return action.league;

        case types.GET_LEAGUE_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            });

        case types.UPDATE_LEAGUE_SUCCESS:
            return action.league;

        case types.UPDATE_LEAGUE_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            });

        case types.CREATE_LEAGUE_SUCCESS:
            return action.league;

        case types.CREATE_LEAGUE_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            });

        default:
            return state;
    }
}