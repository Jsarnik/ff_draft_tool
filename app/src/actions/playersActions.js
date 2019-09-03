import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';

export function getPositionsSuccess(data){
    return {type: types.GET_POSITIONS_SUCCESS, data};
}

export function getPositionsFailure(error){
    return {type: types.GET_POSITIONS_FAILURE, error};
}

export function getPositions(_isDraft){
    let url = `${config.baseApiUri}/api/getPositions`,
    options = {
        isDraft: _isDraft
    };
   
    return function(dispatch){
        return new Promise((resolve, reject)=>{
            axios.post(url, options)
            .then(res => {
                let _data = res.data;
                if(_data.failed){
                    dispatch(getPositionsFailure(_data.failed));
                    reject(_data.failed)
                }else{
                    dispatch(getPositionsSuccess(_data));
                    resolve(_data)
                }
            }).catch(e => {
                dispatch(getPositionsFailure(e));
                reject(e)
            });
        })
    }
}

export function getNFLTeamsSuccess(data){
    return {type: types.GET_NFL_TEAMS_SUCCESS, data};
}

export function getNFLTeamsFailure(error){
    return {type: types.GET_NFL_TEAMS_FAILURE, error};
}

export function getNFLTeams(_isDraft){
    let url = `${config.baseApiUri}/api/getNFLTeams`,
    options = {
        isDraft: _isDraft
    };
   
    return function(dispatch){
        return new Promise((resolve, reject)=>{
            axios.post(url, options)
            .then(res => {
                let _data = res.data;
                if(_data.failed){
                    dispatch(getNFLTeamsFailure(_data.failed));
                    reject(_data.failed)
                }else{
                    dispatch(getNFLTeamsSuccess(_data));
                    resolve(_data)
                }
            }).catch(e => {
                console.log(e);
                dispatch(getNFLTeamsFailure(e));
                reject(e)
            });
        })
    }
}

export function getDraftedPlayersSuccess(data){
    return {type: types.DRAFT_PLAYER_LIST_SUCCESS, data};
}

export function getDraftedPlayersFailure(error){
    return {type: types.DRAFT_PLAYER_LIST_FAILURE, error};
}

export function getDraftedPlayers(_leagueId, _memberId){
    let url = `${config.baseApiUri}/api/getDraftedPlayers`,
    options = {
        leagueId: _leagueId,
        memberId: _memberId
    };
   
    return function(dispatch){
        return new Promise((resolve, reject)=>{
            axios.post(url, options)
            .then(res => {
                let _data = res.data;
                if(_data.failed){
                    dispatch(getDraftedPlayersFailure(_data.failed));
                    reject(_data.failed)
                }else{
                    dispatch(getDraftedPlayersSuccess(_data));
                    resolve(_data)
                }
            }).catch(e => {
                console.log(e);
                dispatch(getDraftedPlayersFailure(e));
                reject(e)
            });
        })
    }
}