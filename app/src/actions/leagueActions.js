import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';

export function getLeagueSuccess(league){
    return {type: types.GET_LEAGUE_SUCCESS, league};
}

export function getLeagueFailure(error){
    return {type: types.GET_LEAGUE_FAILURE, error};
}

export function getLeague(leagueModel){
    let url = `${config.baseApiUri}/api/getLeague`;
    let options = {
        leagueObject: leagueModel
    }
    return function(dispatch){
       return axios.post(url, options)
        .then(res => {
            let error = !res.data.data ? `Could not find league name '${leagueModel.league}'` : res.data.data.error;
            let dispatchFn = error ? getLeagueFailure(error) : getLeagueSuccess(res.data.data);
            dispatch(dispatchFn);
            return res.data.data;
        }).catch(e => {
            dispatch(getLeagueFailure(e.message));
            return e;
        });
    }
}

export function createLeague(leagueModel){
    let url = `${config.baseApiUri}/api/addLeague`;
    let options = {
      leagueObject: leagueModel
    }

    return function(dispatch){
       return axios.post(url, options)
        .then(res => {
            let error = !res.data.data ? `Could not create league name '${leagueModel.league}'` : res.data.data.error;
            let dispatchFn = error ? createLeagueFailure(error) : createLeagueSuccess(res.data.data);
            dispatch(dispatchFn);
            return res.data.data;
        }).catch(e => {
            dispatch(createLeagueFailure(e.message));
            return e;
        });
    }
}

export function createLeagueSuccess(league){
    return {type: types.CREATE_LEAGUE_SUCCESS, league};
}

export function createLeagueFailure(error){
    return {type: types.CREATE_LEAGUE_FAILURE, error};
}

export function updateLeague(leagueModel){
    let url = `${config.baseApiUri}/api/updateLeague`;
    let options = {
        leagueObject: leagueModel
    }
    return function(dispatch){
        return axios.post(url, options)
         .then(res => {
             let error = !res.data.data ? `Could not find league name '${leagueModel.league}'` : res.data.data.error;
             let dispatchFn = error ? updateLeagueFailure(error) : updateLeagueSuccess(res.data.data);
             dispatch(dispatchFn);
         }).catch(e => {
             dispatch(updateLeagueFailure(e.message));
         });
     }
}

export function updateLeagueSuccess(league){
    return {type: types.UPDATE_LEAGUE_SUCCESS, league};
}

export function updateLeagueFailure(error){
    return {type: types.UPDATE_LEAGUE_FAILURE, error};
}
