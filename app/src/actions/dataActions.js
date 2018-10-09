import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';

export function uploadDataSuccess(data){
    return {type: types.GET_LEAGUE_SUCCESS, data};
}

export function uploadDataFailure(error){
    return {type: types.GET_LEAGUE_FAILURE, error};
}

export function uploadData(leagueName){
    
}

export function resetDBSuccess(success){
    return {type: types.RESET_DB_SUCCESS, success};
}

export function resetDBFailure(error){
    return {type: types.RESET_DB_FAILURE, error};
}

export function resetDB(leagueName){
    let url = `${config.baseApiUri}/api/resetDB`;
    let options = {
        leagueName: leagueName
    }
    return function(dispatch){
       return axios.post(url, options)
        .then(res => {
            let dispatchFn = res.data.data.error ? resetDBFailure(res.data.data.error) : resetDBSuccess(res.data.data.success);
            dispatch(dispatchFn);
        }).catch(e => {
            dispatch(resetDBFailure(e.message));
        });
    }
}

export function downloadDraftSuccess(data){
    return {type: types.DOWNLOAD_DRAFT_SUCCESS, data};
}

export function uploadDraftFailure(error){
    return {type: types.DOWNLOAD_DRAFT_FAILURE, error};
}

export function setConfirmDialogOptions(title, execFn){
    return function(dispatch){
        dispatch(setConfirmDialogOptionsSuccess(title, execFn));
    }

    
}

export function setConfirmDialogOptionsSuccess(title, execFn){
    return {type: types.SET_CONFIRM_DIALOG_SUCCESS, title, execFn};
}

export function setConfirmDialogOptionsError(error){
    return {type: types.SET_CONFIRM_DIALOG_FAILURE, error};
}

export function confirmDialogResults(value){
    return function(dispatch){
        dispatch(confirmDialogResultsSuccess(value));
    }
}

export function confirmDialogResultsSuccess(value){
    return {type: types.CONFIRM_DIALOG_RESULT_SUCCESS, value};
}

export function confirmDialogResultsFailure(error){
    return {type: types.CONFIRM_DIALOG_RESULT_FAILURE, error};
}

export function resetConfirmDialog(){
    return function(dispatch){
        dispatch(resetConfirmDialogSuccess());
    }
}

export function resetConfirmDialogSuccess(){
    return {type: types.RESET_ONFIRM_DIALOG_SUCCESS};
}

export function resetConfirmDialogFailure(error){
    return {type: types.RESET_ONFIRM_DIALOG_FAILURE, error};
}