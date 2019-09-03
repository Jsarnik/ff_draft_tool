Object.defineProperty(exports, "__esModule", { value: true });
const Draft = require('./schemas/DraftSchema');
const _ = require('lodash');

class DraftSettingsService{

    TryCreate(draftModel, memberId){
        return new Promise((resolve, reject) => {
            this.GetByLeague(draftModel.leagueId, memberId)
            .then((existingModel)=>{
                if(!existingModel){
                    this.SaveSchema(draftModel).then((savedDraftModel) =>{
                        resolve(savedDraftModel);
                    }).catch((saveErr)=>{
                        reject(saveErr);
                    });
                }else{
                    resolve(existingModel);
                }
            }).catch((getErr)=>{
                reject(getErr);
            });
        });
    }

    GetByLeague(leagueId, memberId){
        return new Promise((resolve, reject) => {
            Draft.findOne({leagueId: leagueId, privateLeagueMemberIds: { "$regex": memberId, "$options": "i" }}, (err, draftModel) => {
                if(err){
                    reject(err);
                }else{
                    resolve(draftModel ? draftModel._doc : null)
                }
            });
        });
    }

    SaveSchema(draftModel){
        return new Promise((resolve, reject) => {
            let newSchema = new Draft(draftModel);
            newSchema.save((err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(draftModel);
                }
            });
        });
    }

    UpdateByLeague(draftModel, leagueId, memberId){
        return new Promise((resolve, reject) => {
            Draft.update({leagueId: leagueId, privateLeagueMemberIds: { "$regex": memberId, "$options": "i" }}, draftModel, (err, updatedDraftModel) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(draftModel);
                }
            });
        });
    }

    Delete(_leagueId, ownerId){
        return new Promise((resolve, reject) => {
            Draft.remove({leagueId: _leagueId}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res)
                }
            });
        });
    }

}

exports.DraftSettingsService = new DraftSettingsService();