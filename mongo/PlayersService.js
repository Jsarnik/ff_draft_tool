Object.defineProperty(exports, "__esModule", { value: true });
var Player = require('./schemas/PlayersSchema');
var _ = require('lodash');

class PlayersSchemaService{
    
    Create(playerObject){
        return new Promise((resolve, reject)=>{
            this.SaveSchema(playerObject).then((savedPlayerObject) =>{
                resolve(savedPlayerObject)
            }).catch((saveErr)=>{
                reject(saveErr);
            });
        });
    }

    GetAll(_league){
        return new Promise((resolve, reject)=>{
            Player.find({league: _league}, (err, players) => {
                if(err){
                    reject(err);  
                }else{
                    let playerMap = {};
                    _.each(players, (player)=>{
                        let p = player._doc;
                        let key = p.name.replace(' ', '_');
                        p.id = key;
                        playerMap[key] = p;
                    });
    
                    resolve(playerMap); 
                } 
            });
        });
    }

    GetByDraftedUser(teamName){
        return new Promise((resolve, reject) => {
            Player.find({draftedByUser: teamName}, (err, players) => {
                if(err){
                    reject(err);  
                }else{
                    let playerMap = {};
                    _.each(players, (player)=>{
                        let p = player._doc;
                        let key = p.name.replace(' ', '_');
                        p.id = key;
                        playerMap[key] = p;
                    });

                    resolve(playerMap);  
                }
            });
        });
    }

    SaveSchema(playerObject){
        return new Promise((resolve, reject) => {
            let newPlayersSchema = new Player(playerObject);
            newPlayersSchema.save((err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(newPlayersSchema._doc);
                }
            });
        });
    }

    DeleteByLeague(leagueName){
        return new Promise((resolve, reject) => {
            Player.remove({league: leagueName}, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        });
    }
    

    Update(playerObject){
        return new Promise((resolve, reject) => {
            Player.update({name: playerObject.name}, playerObject, (err, updatedPlayerModel) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(updatedPlayerModel);
                }
            });
        });
    }

}

exports.PlayersSchemaService = new PlayersSchemaService();