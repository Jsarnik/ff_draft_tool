import * as types from '../actions/actionTypes';

const initialState = {};

export default function playersReducer(state = initialState, action){
    switch(action.type){
        case types.GET_POSITIONS_SUCCESS:
            return {
                ...state,
                    positionsListMap: action.data
            };

        case types.GET_NFL_TEAMS_SUCCESS:
            return {
                ...state,
                    nflTeamsListMap: action.data
            };

        case types.DRAFT_PLAYER_LIST_SUCCESS:
            return {
                ...state,
                    draftedPlayers: action.data
            };
        
        case types.DRAFT_PLAYER_SUCCESS:
                return {
                    ...state,
                        draftedPlayers: {
                            [action.player.id]: action.player
                        }
                };

        default:
            return state;
    }
}