Object.defineProperty(exports, "__esModule", { value: true });
const Picks = require('./schemas/PicksSchema');
const _ = require('lodash');

class PicksService{

    TryCreate(pickModel){
        return new Promise((resolve, reject) => {
            this.GetUniquePick(pickModel)
            .then((existingModel)=>{
                if(!existingModel){
                    this.SaveSchema(pickModel).then((savedPickModel) =>{
                        resolve(savedPickModel);
                    }).catch((saveErr)=>{
                        reject(saveErr);
                    });
                }else{
                    reject({message: "pick already selected"});
                }
            }).catch((getErr)=>{
                reject(getErr);
            });
        });
    }

    GetUniquePick(_pickModel){
        return new Promise((resolve, reject) => {
            Picks.findOne({leagueId: _pickModel.leagueId, memberId: _pickModel.memberId, playerId: _pickModel.playerId}, (err, pickModel) => {
                if(err){
                    reject(err);
                }else{
                    let _model = pickModel ? pickModel._doc : null;
                    resolve(_model);
                }
            });
        });
    }

    GetPicksByLeague(_leagueId){
        return new Promise((resolve, reject) => {
            Picks.find({leagueId: _leagueId}, (err, pickModel) => {
                if(err){
                    reject(err);
                }else{
                    let model = {};
                    _.each(pickModel, (m)=>{
                        model[m._doc.playerId] = m._doc;
                    });
                    resolve(model);
                }
            });
        });
    }


    GetPicksByMember(_pickModel){
        return new Promise((resolve, reject) => {
            Picks.find({leagueId: pickModel.leagueId, memberId: pickModel.memberId}, (err, pickModel) => {
                if(err){
                    reject(err);
                }else{
                    resolve(
                        _.map(pickModel, (m)=>{
                            return m._doc;
                        })
                    );
                }
            });
        });
    }

    SaveSchema(pickModel){
        return new Promise((resolve, reject) => {
            let newSchema = new Picks(pickModel);
            newSchema.save((err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(pickModel);
                }
            });
        });
    }
}

exports.PicksService = new PicksService();