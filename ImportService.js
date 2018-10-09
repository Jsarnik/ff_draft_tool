"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var path = require('path');
var Logger = require('./Logger');
var csv = require("fast-csv");
var playersService = require('./mongo/PlayersService');
var async = require('async');

class ImportService{

    UploadFile(_league){
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, 'data', 'FantasyPros_2018_Draft_Overall_Rankings.csv');
            this.ImportPlayersDraftData(filePath, _league).then((res)=>{
                resolve(res);
            }).catch((err)=>{
                reject(err);
            });
        })
    }

    DeleteFile(){

    }

    ImportPlayersDraftData(filePath, _league){
        return new Promise((resolve, reject) => {
            playersService.PlayersSchemaService.DeleteByLeague(_league).then((deleteRes)=>{
                let data = [];
                let index = 0;
                csv.fromPath(filePath).on("data", function(row){
                    if(index !== 0){
                        let playerObject = {
                            league: _league,
                            rank: row[0],
                            name: row[2],
                            team: !row[3] || row[3] == '' ? validate(row[2]) : row[3],
                            pos: row[4],
                            bye: row[5],
                            best: row[6],
                            worst: row[7],
                            avg: row[8],
                            isDrafted: false,
                            draftedByUser: ''
                        }
                        data.push(playerObject);
                    }
                    index++;
    
                    function validate(name){
                        return !name ? '' : name.split('(')[1].split(')')[0] || '';
                    }
    
                }).on("end", function(){
                    let count = 1;
                    async.each(data, (playerObject, next)=>{
                        playersService.PlayersSchemaService.Create(playerObject).then((createPlaterRes)=>{
                            count++;
                            next();
                        }).catch((createPlayerErr)=>{
                            Logger.NodeLogger.log({
                                level : 'error',
                                message: `'Failed to import ${playerObject.name}', Reason: ${createPlayerErr}`
                            });
                            next();
                        });
                    }, (err)=>{
                        if(err){
                            Logger.NodeLogger.log({
                                level : 'error',
                                message: 'Failed to import 1 or more players'
                            });
                            reject(err);
                        }else{
                            resolve({success: `Successfully imported ${ count } of ${index-1} players.`}); 
                        }
                    });
                });
            }).catch((deleteErr)=>{
                Logger.NodeLogger.log({
                    level : 'error',
                    message: 'Failed to deete old data.'
                });
                reject(deleteErr);
            });
        });
        
    }
}
exports.ImportService = new ImportService();