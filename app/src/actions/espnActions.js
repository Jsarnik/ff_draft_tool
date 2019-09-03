import * as types from './actionTypes';
import config from '../globals';
import axios from 'axios';
import * as _ from 'lodash';

export function getPrivateDraftSuccess(data, user){
    return {type: types.GET_PRIVATE_DRAFT_SUCCESS, data, user};
}

export function getPrivateDraftFailure(error){
    return {type: types.GET_PRIVATE_DRAFT_FAILURE, error};
}

export function getPrivateDraft(){
    let url = `${config.baseApiUri}/api/privateLeague`,
    options = {
        leagueId: 565418,
        cookies:{
            espnS2: 'AECBSsTqgmljXsxN3gBY60qs%2BYinq8sV4nQgl9dzsoAxbWovpLZG%2BnPXzuVUTpTWs%2FwU6n6qgx0%2FaOgy3ew78OifpVbYmNSvvDw5o0bFZL69DMLPD3JGnXWa3A9DPPXsMiJ6jOevc73%2BQfIr3lnvJRnZRhcYEzuPWwR%2BItU%2F1v1f7sVmZ0hUd0WVupSLuIIfp6Hp9nXZW3pIO4jjcB%2B3f87gKZXlEyNKrAMqrDicLUX6ERE27KWCBDaT2Tv59785fJo%3D',
            SWID: '{F2D6BEDA-B707-49EE-96BE-DAB70799EEE0}'
        }
    };
   
    return function(dispatch){
        return new Promise((resolve, reject)=>{
            axios.post(url, options)
            .then(res => {
                let _data = res.data;
                if(_data.failed){
                    dispatch(getPrivateDraftFailure(_data.failed));
                    reject(_data.failed);
                }else{
                    let cookieArray = document.cookie.split(';'),
                    cookieObject = {};
                    
                    _.each(cookieArray, cookie => {
                        let [key, value] = cookie.split('=');
                        cookieObject[key.trim()] = value;
                    
                    });
                    let userModel = _.find(_data.members, {'id': cookieObject.SWID});
                    userModel.team = _.find(_data.teams, (o)=>{
                        return o.owners.indexOf(cookieObject.SWID) !== -1;
                    });
                    userModel.leagueId = _data.id;

                    dispatch(getPrivateDraftSuccess(_data, userModel));
                    resolve({data: _data, userModel: userModel});
                }
            }).catch(e => {
                dispatch(getPrivateDraftFailure(e));
                reject(e)
            });
        })
    }
}