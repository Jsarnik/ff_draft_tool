import * as types from '../actions/actionTypes';
import * as _ from 'lodash';

const initialState =  {};

export default function userReducer(state = initialState, action){
    switch(action.type){
        case types.GET_PRIVATE_DRAFT_SUCCESS:
            return action.user;
    
        default:
            return state;
    }
}