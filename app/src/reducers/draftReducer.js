import * as types from '../actions/actionTypes';

const initialState =  {};

export default function draftReducer(state = initialState, action){
    switch(action.type){
        case types.GET_DRAFT_SETTINGS_SUCCESS:
            return action.data;

        default:
            return state;
    }
}