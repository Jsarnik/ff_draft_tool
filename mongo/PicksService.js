Object.defineProperty(exports, "__esModule", { value: true });
var Pick = require('./schemas/PicksSchema');
var _ = require('lodash');

class PicksSchemaService{

    Create(pickObject){
        return new Promise((resolve, reject) => {
            this.GetOne(pickObject)
            .then((existingPick) => {
                if(!existingPick){
                    this.SaveSchema(pickObject).then((savedPickObject) => {
                        resolve(savedPickObject);
                    }).catch((saveErr) => {
                        reject(saveErr);
                    });
                }else{
                    reject({message:"Pick already Exists"});
                }
            }).catch((pickErr) => {
                reject(pickErr);
            });
        });
    }

    GetAll(){
        return new Promise((resolve, reject)=>{
            Pick.find({}, (err, picks) => {
                if(err){
                    reject(err); 
                }else{    
                    let picksMap = {};
                    let count = 0;
                    _.each(picks, (pick)=>{
                        let id = `pick_${count}`;
                        let p = pick._doc;
                        picksMap[id] = p;
                        count++;
                    });
        
                    resolve(picksMap);  
                }
            });
        });
    }

    GetOne(pickObject){
        return new Promise((resolve, reject)=>{
            Pick.findOne({league: pickObject.league, teamName: pickObject.teamName, roundDraft: pickObject.roundDraft}, (err, pick)=>{
                if(err){
                    reject(err);
                }else{
                    let _p = pick ? pick._doc : null;
                    resolve(_p);
                }
            });
        });
    }

    GetAllByTeam(team){
        return new Promise((resolve, reject)=>{
            Pick.find({teamName:team}, (err, picks) => {
                if(err){
                    reject(err);  
                }

                let picksMap = {};  
                _.each(picks, (pick)=>{
                    let id = `round_${pick.roundDraft}`;
                    let p = pick._doc;
                    picksMap[id] = p;
                });

                resolve(picksMap);  
            });
        });
    }

    SaveSchema(pickObject){
        return new Promise((resolve, reject)=>{
            let newPickSchema = new Pick(pickObject);
            newPickSchema.save((err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(pickObject)
                }
            });
        });
    }

    Delete(deletePick){
        return new Promise((resolve, reject)=>{
            Pick.remove({league: deletePick.league, playerId: deletePick.playerId}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            })
        });
    }

    DeleteByLeague(leagueName){
        return new Promise((resolve, reject)=>{
            Pick.remove({league: leagueName}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            })
        });
    }

}

exports.PicksSchemaService = new PicksSchemaService();