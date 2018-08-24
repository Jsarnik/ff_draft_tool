Object.defineProperty(exports, "__esModule", { value: true });
var Team = require('./schemas/TeamsSchema');
var _ = require('lodash');

class TeamsSchemaService{
    
    Create(teamObject, nextFn){
        this.SaveSchema(teamObject, (saveErr, savedTeamObject) =>{
            return nextFn(saveErr, savedTeamObject);
        });
    }

    GetAll(nextFn){
        Team.find({}, function(err, teams) {
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

    GetOne(name, nextFn){
        Team.findOne({name:name}, function(err, team) {
            if(err){
                return nextFn(err);  
            }

            nextFn(null, team._doc);  
        });
    }

    SaveSchema(teamObject, nextFn){
        var newTeamSchema = new Team(teamObject);
        newTeamSchema.save((err) =>{
            return nextFn(err, newTeamSchema._doc);
        });
    }

    Delete(name, nextFn){
        Team.remove({name: name}, (err, res)=>{
            nextFn(err, res);
        })
    }

}

exports.TeamsSchemaService = new TeamsSchemaService();