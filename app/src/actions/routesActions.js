import * as types from './actionTypes';

export function setLeagueNameSuccess(leagueName){
    return {type: types.SET_LEAGUE_NAME_SUCCESS, leagueName};
}

export function setLeagueNameFailure(error){
    return {type: types.SET_LEAGUE_NAME_FAILURE, error};
}

export function setLeagueName(leagueName){
    return function(dispatch){
        if(leagueName){
            dispatch(setLeagueNameSuccess(leagueName));
        }else{
            dispatch(setLeagueNameFailure('No LeagueName to set.'));
        }
    }
}