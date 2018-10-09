import * as types from '../actions/actionTypes';

export default function leagueReducer(state = {}, action){
    switch(action.type){
        case types.SET_LEAGUE_NAME_SUCCESS:
            return Object.assign({}, state, {
                leagueName: action.leagueName
            });

        case types.SET_LEAGUE_NAME_FAILURE:
            return Object.assign({}, state, {
                leagueName: null
            });

        default:
            return state;
    }
}