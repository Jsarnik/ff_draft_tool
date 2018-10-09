Object.defineProperty(exports, "__esModule", { value: true });
var Team = require('./schemas/TeamsSchema');
var _ = require('lodash');

class TeamsSchemaService{
    
    TryCreate(teamObject){
        return new Promise((resolve, reject) => {
          this.GetOne(teamObject)
            .then((existingTeamObject) => {
                if(!existingTeamObject){
                    this.SaveSchema(teamObject).then((savedTeamObject) => {
                        resolve(savedTeamObject);
                    }).catch((saveErr) => {
                        reject(saveErr);
                    });
                }else{
                    reject({message:"Team already Exists"});
                }
            }).catch((getErr) => {
                reject({message:getErr});
            });
        });
    }

    GetAll(leagueName){
        return new Promise((resolve, reject) => {
            Team.find({league: leagueName}, (err, teams) => {
                if(err){
                    reject(err);  
                }else{
                    let teamsMap = {};
                    _.each(teams, (team)=>{
                        let t = team._doc;
                        teamsMap[t.name] = t;
                    });
    
                    resolve(teamsMap); 
                } 
            });
        });
    }

    GetOne(teamObject){
        return new Promise((resolve, reject) => {
            Team.findOne({league: teamObject.league, name:teamObject.name}, (err, team) => {
                if(err){
                    reject(err);
                }else{
                    let _t = team ? team._doc : null;
                    resolve(_t);
                }
            });
        });
    }

    SaveSchema(teamObject){
        return new Promise((resolve, reject) => {
            let newTeamSchema = new Team(teamObject);
            newTeamSchema.save((err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(newTeamSchema._doc)
                }
            });
        });
    }

    CreateAndDelete(teamObject, keyChangeRequiresDelete){
        return new Promise((resolve, reject) => {
            this.Delete({name: keyChangeRequiresDelete}).then((successFullDelete) => {
                this.TryCreate(teamObject).then((newTeamObject) => {
                    resolve(newTeamObject);
                }).catch((createErr)=>{
                    reject(createErr);
                });
            }).catch((deleteErr)=>{
                reject(deleteErr);
            });
        });
    }

    Update(teamObject){
        return new Promise((resolve, reject) => {
            Team.update({name: teamObject.name}, teamObject, (err, updatedTeamObject) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(updatedTeamObject);
                }
            });
        });
    }

    Delete(teamObject){
        return new Promise((resolve, reject) => {
            Team.remove({name: teamObject.name}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                } 
            })
        });
    }

    DeleteByLeague(leagueName){
        return new Promise((resolve, reject) => {
            Team.remove({league: leagueName}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                } 
            })
        });
    }

}

exports.TeamsSchemaService = new TeamsSchemaService();