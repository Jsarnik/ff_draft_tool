Object.defineProperty(exports, "__esModule", { value: true });
var Team = require('./schemas/TeamsSchema');
var _ = require('lodash');

class TeamsSchemaService{
    
    Create(teamObject, nextFn){
        this.GetOne(teamObject, (getErr, getRes) =>{
            if(!getRes){
                this.SaveSchema(teamObject, (saveErr, savedTeamObject) =>{
                    return nextFn(saveErr, savedTeamObject);
                });
            }else{
                return nextFn(getErr);
            }
        })

    }

    GetAll(leagueName, nextFn){
        Team.find({league: leagueName}, function(err, teams) {
            if(err){
                return nextFn(err);  
            }

            var teamsMap = {};
        
            _.each(teams, (team)=>{
                let t = team._doc;
                teamsMap[t.name] = t;
            });

            nextFn(null, teamsMap);  
        });
    }

    GetOne(teamObject, nextFn){
        Team.findOne({league: teamObject.league, name:teamObject.team}, function(err, team) {
            let _t = team ? team._doc : null;
            nextFn(err, _t);
        });
    }

    SaveSchema(teamObject, nextFn){
        var newTeamSchema = new Team(teamObject);
        newTeamSchema.save((err) =>{
            return nextFn(err, newTeamSchema._doc);
        });
    }

    Delete(teamObject, nextFn){
        Team.remove({name: teamObject.name}, (err, res)=>{
            nextFn(err, res);
        })
    }

}

exports.TeamsSchemaService = new TeamsSchemaService();