import * as types from '../actions/actionTypes';

export default function playersReducer(state = {}, action){
    switch(action.type){
        case types.GET_PLAYERS_SUCCESS:
            return action.players;

        case types.GET_PLAYERS_FAILURE:
            return action.error;

        case types.DRAFT_PLAYER_SUCCESS:
            return Object.assign({}, state, {
                [action.player.id]: action.player
            });

        case types.DRAFT_PLAYER_FAILURE:
            return Object.assign({}, state, {
                [action.player.id]: Object.assign({}, state[action.player.id], {
                    error: action.error
                })
            });

        case types.UNDRAFT_PLAYER_SUCCESS:
            return Object.assign({}, state, {
                [action.player.id]: action.player
            });

        case types.UNDRAFT_PLAYER_FAILURE:
            return action.error;

        default:
            return state;
    }
}