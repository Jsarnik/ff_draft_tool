"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Logger = require('./logger');
var csv = require("fast-csv");
var playersService = require('./mongo/PlayersService');
var async = require('async');

class InportService{

    UploadFile(doneFn){
        const filePath = path.join(__dirname, 'data', 'FantasyPros_2018_Draft_Overall_Rankings.csv');
        this.ImportPlayersDraftData(filePath, doneFn);
    }

    DeleteFile(){

    }

    ImportPlayersDraftData(filePath, doneFn){
        playersService.PlayersSchemaService.DeleteAll((err, res)=>{
            if(err){
                Logger.NodeLogger.log({
                    level : 'error',
                    message: 'Failed to deete old data.'
                });
                return doneFn(err);
            }

            let data = [];
            let index = 0;
            csv.fromPath(filePath).on("data", function(row){
                if(index !== 0){
                    let playerObject = {
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
                    return !name ? '' : name.split('(')[1].replace(')') || '';
                }

            }).on("end", function(){
                let count = 1;
                async.each(data, (playerObject, next)=>{
                    playersService.PlayersSchemaService.Create(playerObject, (err, res)=>{
                        next();
                        if(!err){
                            count++;
                        }else{
                            Logger.NodeLogger.log({
                                level : 'error',
                                message: `'Failed to import ${playerObject.name}', Reason: ${err}`
                            });
                        }
                    });
                }, (err)=>{
                    if(err){
                        Logger.NodeLogger.log({
                            level : 'error',
                            message: 'Failed to import 1 or more players'
                        });
                        return doneFn(err);
                    }else{
                        return doneFn(null, {success: `Successfully imported ${ count } of ${index-1} players.`});
                        console.log(`Successfully imported ${ count } of ${index-1} players.`);
                    }
                });
            });
        });
    }
}
exports.ImportService = new InportService();