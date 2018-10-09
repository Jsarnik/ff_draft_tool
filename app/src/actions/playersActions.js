import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';


//GET PLAYERS
export function getPlayersSuccess(players, leagueName){
    return {type: types.GET_PLAYERS_SUCCESS, players, leagueName};
}

export function getPlayersFailure(error){
    return {type: types.GET_PLAYERS_FAILURE, error};
}

export function getPlayers(leagueName){
    let url = `${config.baseApiUri}/api/getPlayers`;
    let options = {
        league: leagueName
    }
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? getPlayersFailure(res.data.data.error) : getPlayersSuccess(res.data.data, leagueName);
            dispatch(dispatchFn);
        }).catch(e => {
            dispatch(getPlayersFailure(e.message));
        });
    }
}

//DRAFT PLAYER
export function draftPlayerSuccess(player){
    return {type: types.DRAFT_PLAYER_SUCCESS, player};
}

export function draftPlayerFailure(player, error){
    return {type: types.DRAFT_PLAYER_FAILURE, player, error};
}


export function draftPlayer(player){
    let url = `${config.baseApiUri}/api/draftPlayer`;
    let options = {
        draftOptions: player
    }
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? draftPlayerFailure(player, res.data.data.error) : draftPlayerSuccess(player);
            dispatch(dispatchFn);
        }).catch(e => {
            dispatch(draftPlayerFailure(player, e.message));
        });
    }
}

//UNDRAFT PLAYER
export function unDraftPlayerSuccess(player){
    return {type: types.UNDRAFT_PLAYER_SUCCESS, player};
}

export function unDraftPlayerFailure(error){
    return {type: types.UNDRAFT_PLAYER_FAILURE, error};
}

export function unDraftPlayer(player){
    let url = `${config.baseApiUri}/api/unDraftPlayer`;
    let options = {
        unDraftOptions: player
    }
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? unDraftPlayerFailure(res.data.data.error) : unDraftPlayerSuccess(player);
            dispatch(dispatchFn);
        }).catch(e => {
            dispatch(unDraftPlayerFailure(e.message));
        });
    }
}