import * as types from '../actions/actionTypes';

const initialState =  {
    members: null,
    players: null,
    teams: null
}

export default function espnReducer(state = initialState, action){
    switch(action.type){
        case types.GET_PRIVATE_DRAFT_SUCCESS:
            return action.data;
        
        default:
            return state;
    }
}