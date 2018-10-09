import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';

//GET TEAMS
export function getTeamsSuccess(teams, leagueName){
    return {type: types.GET_TEAMS_SUCCESS, teams, leagueName};
}

export function getTeamsFailure(error, leagueName){
    return {type: types.GET_TEAMS_FAILURE, error, leagueName};
}

export function getTeams(leagueName){
    let url = `${config.baseApiUri}/api/getTeams`;
    let options = {
        league: leagueName
    };
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? getTeamsFailure(res.data.data.error, leagueName) : getTeamsSuccess(res.data.data, leagueName);
            dispatch(dispatchFn);
            return res.data.data;
        }).catch(e => {
            dispatch(getTeamsFailure(e.message, leagueName));
            return e.message;
        });
    }
}

//CREATE TEAMS
export function createTeamSuccess(team){
    return {type: types.CREATE_TEAM_SUCCESS, team};
}

export function createTeamFailure(error, team){
    return {type: types.CREATE_TEAM_FAILURE, error, team};
}

export function createTeam(team){
    let url = `${config.baseApiUri}/api/addTeam`;
    let options = {
        teamObject: team
    };
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? createTeamFailure(res.data.data.error, team) : createTeamSuccess(team);
            dispatch(dispatchFn);
        }).catch(e => {
            dispatch(createTeamFailure(e.message, team));
        });
    }
}

//UPDATE TEAM
export function updateTeam(team, keyChangeRequiresDelete){
    let url = `${config.baseApiUri}/api/updateTeam`;
    let options = {
        keyChangeRequiresDelete: keyChangeRequiresDelete,
        teamObject: team
    };
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? createTeamFailure(res.data.data.error, team) : createTeamSuccess(team);
            dispatch(dispatchFn);
            if(keyChangeRequiresDelete){
                dispatch(deleteTeamSuccess(team.league, keyChangeRequiresDelete));
            }
        }).catch(e => {
            dispatch(createTeamFailure(e.message, team));
        });
    }
}

//DELETE TEAMS
export function deleteTeamSuccess(leagueName, teamName){
    return {type: types.DELETE_TEAM_SUCCESS, leagueName, teamName};
}

export function deleteTeamFailure(error, team){
    return {type: types.DELETE_TEAM_FAILURE, error, team};
}

export function deleteTeam(team){
    let url = `${config.baseApiUri}/api/deleteTeam`;
    let options = {
        teamObject: team
    };
    return function(dispatch){
        return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? deleteTeamFailure(res.data.data.error, team) : deleteTeamSuccess(team.league, team.name);
            dispatch(dispatchFn);
        }).catch(e => {
            dispatch(deleteTeamFailure(e.message, team));
        });
    }
}

// ADD/REMOVE DRAFT PICK
export function updatePickFailure(error){
    return {type: types.UPDATE_PICK_FAILURE, error};
}

export function addPickSuccess(key, pick){
    return {type: types.ADD_PICK_SUCCESS, key, pick};
}

export function deletePickSuccess(key, pick){
    return {type: types.DELETE_PICK_SUCCESS, key, pick};
}

export function updatePick(pickObject, isDelete){
    return function(dispatch){

        if(!pickObject){
            return dispatch(updatePickFailure('No pick data.'));
        }

        if(isDelete){
            dispatch(deletePickSuccess(pickObject.roundKey, pickObject.pick));
        }else{
            dispatch(addPickSuccess(pickObject.roundKey, pickObject.pick));
        }
    }
}