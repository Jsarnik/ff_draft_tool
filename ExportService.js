"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Logger = require('./Logger');
var csv = require("fast-csv");
var playersService = require('./mongo/PlayersService');
var picksService = require('./mongo/PicksService');
var teamsService = require('./mongo/TeamsService');
var leagueService = require('./mongo/LeagueService');
var async = require('async');

class ExportService{
    GetDraftResults(leagueName, isDownloadOnly){
        return new Promise((resolve, reject) => {
            if(isDownloadOnly){
                leagueService.LeagueSchemaService.GetByLeague(leagueName).then(leagueRes => {
                    if(!_.isEmpty(leagueRes)){
                        resolve({path: path.join(__dirname, `/data/${leagueName}.xlsx`), fileName: `${leagueName}.xlsx`});
                    }else{
                        reject('No Team Found');
                    }
                }).catch(leagueErr=>{
                    reject(leagueErr);
                });
            }else{
                this.GetLeagueTeamsAndPicks(leagueName).then(GetLeagueTeamsAndPicksRes => {
                    this.ExportPlayersDraftData(GetLeagueTeamsAndPicksRes).then(ExportPlayersDraftDataRes => {
                        resolve(ExportPlayersDraftDataRes);
                    }).catch(ExportPlayersDraftDataErr=>{
                        reject(ExportPlayersDraftDataErr);
                    });
    
                }).catch(GetLeagueTeamsAndPicksErr=>{
                    reject(GetLeagueTeamsAndPicksErr);
                });
            }
        });
    }

    GetLeagueTeamsAndPicks(leagueName){
        let draftModel = {
            leagueName: leagueName
        };
        return new Promise((resolve, reject) => {
            leagueService.LeagueSchemaService.GetByLeague(leagueName).then(leagueRes => {
                if(!_.isEmpty(leagueRes)){
                    teamsService.TeamsSchemaService.GetAll(leagueName).then((teamsResponse)=>{
                        if(_.isEmpty(teamsResponse)){
                            return reject(`No teams results for league ${leagueName}.`);
                        }
                        draftModel.teams = teamsResponse;
                        playersService.PlayersSchemaService.GetAll(leagueName).then(playersRes => {
                            draftModel.players = playersRes
                            async.each(draftModel.teams, (team, next)=>{
                                picksService.PicksSchemaService.GetAllByTeam(team.name).then((pickResponse) => {
                                    if(pickResponse){
                                        team.picks = pickResponse;
                                    }
                                    next();
                                }).catch((pickErr) =>{
                                    next();
                                });
                            }, (asyncErr)=>{
                                if(asyncErr){
                                    reject(asyncErr);
                                }else{
                                    resolve(draftModel);
                                }
                            });
                        }).catch(playersErr => {
                            reject(playersErr);
                        });
                    }).catch((teamsErr)=>{
                        reject(teamsErr);
                    });
                }else{
                    reject({ message: `No league found ${leagueName}`});
                }
            }).catch((leagueErr)=>{
                reject(leagueErr);
            });
        });
    }

    ExportPlayersDraftData(draftModel){
        return new Promise((resolve, reject) => {
            const excel = require('excel4node');
            try{
                let wb = new excel.Workbook();
                let headerStyle = wb.createStyle({
                        font: {
                            color: '#000000',
                            size: 14,
                            bold: true
                        },
                        numberFormat: '#0;'
                    });
                let style = wb.createStyle({
                        font: {
                            color: '#000000',
                            size: 12
                        },
                        numberFormat: '#0;'
                    });

                _.each(draftModel.teams, (team)=>{
                    // Header row
                    let ws = wb.addWorksheet(team.displayName);
                    ws.cell(1,1).string('Player Name').style(headerStyle);
                    ws.cell(1,2).string('Team').style(headerStyle);
                    ws.cell(1,3).string('Position').style(headerStyle);
                    ws.cell(1,4).string('Bye').style(headerStyle);
                    ws.cell(1,5).string('Round Drafted').style(headerStyle);
                    ws.cell(1,6).string('Drafted Overall').style(headerStyle);
                    
                    //Picks
                    let rowIndex = 2;
                    _.each(team.picks, (pick, i)=>{
                        let _player = draftModel.players[pick.playerId];
                        ws.cell(rowIndex,1).string(_player.name).style(style);
                        ws.cell(rowIndex,3).string(_player.team).style(style);
                        ws.cell(rowIndex,2).string(_player.pos).style(style);
                        ws.cell(rowIndex,4).number(_player.bye).style(style);
                        ws.cell(rowIndex,5).number(_player.roundDrafted).style(style);
                        ws.cell(rowIndex,6).number(_player.overall).style(style);
                        rowIndex++;
                    });
                });

                let tempPath = path.join(__dirname, `/data/${draftModel.leagueName}.xlsx`);
                wb.write(tempPath, (err, stats) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({path: tempPath, fileName: `${draftModel.leagueName}.xlsx`});
                    }
                });
            }catch(ExportPlayersDraftDataEx){
                reject(ExportPlayersDraftDataEx);
            }
        });
    }
}
exports.ExportService = new ExportService();