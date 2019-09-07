import * as types from '../actions/actionTypes';
import * as _ from 'lodash';
import { bindActionCreators } from 'redux';

const initialState =  {
    user: null,
    cookies: null,
    espnUser: null
};

export default function userReducer(state = initialState, action){
    switch(action.type){
        case types.GET_PRIVATE_DRAFT_SUCCESS:
            return {
                ...state,
                user: action.user
            }
    
        case 'GET_COOKIES_SUCCESS':
            return {
                ...state,
                cookies: action.cookies
            }

        case types.GET_ESPN_USER_SUCCESS:
            return{
                ...state,
                espnUser: action.espnUser,
                cookies: action.cookies
            }

        default:
            return state;
    }
}