import * as types from '../actions/actionTypes';

const initialState =  {
    report: null,
    draft:{
        members: null,
        players: null,
        teams: null
    }
}

export default function espnReducer(state = initialState, action){
    switch(action.type){
        case types.GET_PRIVATE_DRAFT_SUCCESS:
            return action.data;
        
        case types.GET_LEAGUE_DATA_SUCCESS:
            return {
                ...state,
                report: action.reportData
            }

        default:
            return state;
    }
}