Object.defineProperty(exports, "__esModule", { value: true });
var League = require('./schemas/LeagueSchema');
var _ = require('lodash');

class LeagueSchemaService{
    
    Create(leagueObject){
        return new Promise((resolve, reject) => {
            this.GetByLeague(leagueObject.league)
            .then((existingLeague)=>{
                if(!existingLeague){
                    this.SaveSchema(leagueObject).then((savedLeagueObject) =>{
                        resolve(savedLeagueObject);
                    }).catch((saveErr)=>{
                        reject(saveErr);
                    });
                }else{
                    reject({message:"League already Exists"});
                }
            }).catch((getErr)=>{
                reject(getErr);
            });
        });
    }

    GetByLeague(leagueName){
        return new Promise((resolve, reject) => {
            League.findOne({league: leagueName}, (err, leagueRes) => {
                if(err){
                    reject(err);
                }else{
                    let _l = leagueRes ? leagueRes._doc : null;
                    resolve(_l);
                }
            });
        });
    }

    GetAll(){
        return new Promise((resolve, reject) => {
            League.find({}, (err, leagueRes) => {
                if(err){
                    reject(err);
                }else{
                    let _leagues = {};
                    _.each(leagueRes, (_l)=>{
                        _leagues[_l.league] = _l
                    })
                    resolve(_leagues);
                }
            });
        });
    }

    SaveSchema(leagueObject){
        return new Promise((resolve, reject) => {
            let newLeagueSchema = new League(leagueObject);
            newLeagueSchema.save((err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(newLeagueSchema._doc);
                }
            });
        });
    }

    Update(leagueObject){
        return new Promise((resolve, reject) => {
            League.update({league: leagueObject.league}, leagueObject, (err, updatedleagueObject) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(updatedleagueObject);
                }
            });
        });
    }

    Delete(leagueName){
        return new Promise((resolve, reject) => {
            League.remove({league: leagueName}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res)
                }
            });
        });
    }

}

exports.LeagueSchemaService = new LeagueSchemaService();