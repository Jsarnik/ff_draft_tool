import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';
import * as _ from 'lodash';

export function getDraftSettingsSuccess(data){
    return {type: types.GET_DRAFT_SETTINGS_SUCCESS, data};
}

export function getDraftSettingsFailure(error){
    return {type: types.GET_DRAFT_SETTINGS_FAILURE, error};
}

export function getDraftSettings(_leagueId, userId){
    let url = `${config.baseApiUri}/api/getDraftSettings`,
    options = {
        leagueId: _leagueId,
        memberId: userId
    };
   
    return function(dispatch){
        return new Promise((resolve, reject)=>{
            axios.post(url, options)
            .then(res => {
                let _data = res.data;
                if(_data.failed){
                    dispatch(getDraftSettingsFailure(_data.failed));
                    reject(_data.failed);
                }else{
                    dispatch(getDraftSettingsSuccess(_data));
                    resolve(_data);
                }
            }).catch(e => {
                console.log(e);
                dispatch(getDraftSettingsFailure(e));
                reject(e)
            });
        })
    }
}

export function setDraftPickSuccess(data){
    return {type: types.GET_DRAFT_SETTINGS_SUCCESS, data};
}

export function setDraftPickFailure(error){
    return {type: types.SET_DRAFT_PICK_FAILURE, error};
}

export function setDraftPick(_pickModel){
    let url = `${config.baseApiUri}/api/setDraftPick`,
    options = {
        pickModel: _pickModel
    };
   
    return function(dispatch){
        return new Promise((resolve, reject)=>{
            axios.post(url, options)
            .then(res => {
                let _data = res.data;
                if(_data.failed){
                    dispatch(setDraftPickFailure(_data.failed));
                    reject(_data.failed);
                }else{
                    dispatch(setDraftPickSuccess(_data));
                    resolve(_data);
                }
            }).catch(e => {
                dispatch(setDraftPickFailure(e));
                reject(e)
            });
        })
    }
}