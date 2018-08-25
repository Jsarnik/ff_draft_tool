Object.defineProperty(exports, "__esModule", { value: true });
var League = require('./schemas/LeagueSchema');
var _ = require('lodash');

class LeagueSchemaService{
    
    Create(leagueObject, nextFn){
        this.GetByLeague(leagueObject.league, (getErr, getRes)=>{
            if(!getRes){
                this.SaveSchema(leagueObject, (saveErr, savedLeagueObject) =>{
                    return nextFn(saveErr, savedLeagueObject);
                });
            }else{
                return nextFn(getErr);
            }
        });
    }

    GetByLeague(leagueName, nextFn){
        League.findOne({league: leagueName}, function(err, leagueRes) {
            let _l = leagueRes ? leagueRes._doc : null;
            nextFn(err, _l);
        });
    }

    SaveSchema(leagueObject, nextFn){
        var newLeagueSchema = new League(leagueObject);
        newLeagueSchema.save((err) =>{
            return nextFn(err, newLeagueSchema._doc);
        });
    }

    DeleteAll(nextFn){
        League.remove({}, (err, res)=>{
            nextFn(err, res);
        })
    }

}

exports.LeagueSchemaService = new LeagueSchemaService();