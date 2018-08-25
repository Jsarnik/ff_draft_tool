Object.defineProperty(exports, "__esModule", { value: true });
var Pick = require('./schemas/PicksSchema');
var _ = require('lodash');

class PicksSchemaService{
    
    Create(pickObject, nextFn){
        this.GetOne(pickObject, (getErr, getRes)=>{
            if(!getRes){
                this.SaveSchema(pickObject, (saveErr, savedPickObject) =>{
                    return nextFn(saveErr, savedPickObject);
                });
            }else{
                return nextFn(getErr);
            }
        })

    }

    GetAll(nextFn){
        Pick.find({}, function(err, picks) {
            if(err){
                return nextFn(err);  
            }

            var picksMap = {};
            
            let count = 0;
            _.each(picks, (pick)=>{
                let id = `pick_${count}`;
                let p = pick._doc;
                picksMap[id] = p;
                count++;
            });

            nextFn(null, picksMap);  
        });
    }

    GetOne(pickObject, nextFn){
        Pick.findOne({league: pickObject.league, teamName: pickObject.teamName}, function(err, pick){
            let _p = pick ? pick_.doc : null;
            nextFn(err, _p);
        });
    }

    GetAllByTeam(team, nextFn){
        Pick.find({teamName:team}, function(err, picks) {
            if(err){
                return nextFn(err);  
            }

            var picksMap = {};
            
            _.each(picks, (pick)=>{
                let id = `round_${pick.roundDraft}`;
                let p = pick._doc;
                picksMap[id] = p;
            });

            nextFn(null, picksMap);  
        });
    }

    SaveSchema(pickObject, nextFn){
        var newPickSchema = new Pick(pickObject);
        newPickSchema.save((err) =>{
            return nextFn(err, newPickSchema._doc);
        });
    }

    Delete(deletePick, nextFn){
        Pick.remove({league: deletePick.league, playerId: deletePick.playerId}, (err, res)=>{
            nextFn(err, res);
        })
    }

}

exports.PicksSchemaService = new PicksSchemaService();