Object.defineProperty(exports, "__esModule", { value: true });
var Player = require('./schemas/PlayersSchema');
var _ = require('lodash');

class PlayersSchemaService{
    
    Create(playerObject, nextFn){
        this.SaveSchema(playerObject, (saveErr, savedPlayerObject) =>{
            return nextFn(saveErr, savedPlayerObject);
        });
    }

    GetAll(_league, nextFn){
        Player.find({league: _league}, function(err, players) {
            if(err){
                return nextFn(err);  
            }

            var playerMap = {};
        
            _.each(players, (player)=>{
                let p = player._doc;
                let key = p.name.replace(' ', '_');
                p.id = key;
                playerMap[key] = p;
            });

            nextFn(null, playerMap);  
        });
    }

    GetByDraftedUser(teamName, nextFn){
        Player.find({draftedByUser: teamName}, function(err, players) {
            if(err){
                return nextFn(err);  
            }

            var playerMap = {};
        
            _.each(players, (player)=>{
                let p = player._doc;
                let key = p.name.replace(' ', '_');
                p.id = key;
                playerMap[key] = p;
            });

            nextFn(null, playerMap);  
        });
    }

    SaveSchema(playerObject, nextFn){
        var newPlayersSchema = new Player(playerObject);
        newPlayersSchema.save((err) =>{
            return nextFn(err, newPlayersSchema._doc);
        });
    }

    DeleteAll(nextFn){
        Player.remove({}, (err, res)=>{
            nextFn(err, res);
        })
    }

    Update(playerObject, nextFn){
        Player.update({name: playerObject.name}, playerObject, (err, updatedPlayerModel) =>{
            nextFn(err, playerObject);
        });
    }

}

exports.PlayersSchemaService = new PlayersSchemaService();