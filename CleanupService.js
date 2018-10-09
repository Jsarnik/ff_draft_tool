"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var Logger = require('./Logger');
var leagueService = require('./mongo/LeagueService');
var playersService = require('./mongo/PlayersService');
var teamsService = require('./mongo/TeamsService');
var picksService = require('./mongo/PicksService');
var exportService = require('./ExportService');

const intervalTimeMs = 86400000; // 24 hrs;
const deleteEntriesOlderThanMS = 259200000; // 72 hrs
let cleanupInterval;

class CleanupService{

    Initialize(){
        if(cleanupInterval){
            clearInterval(cleanupInterval);
        }

        cleanupInterval = setInterval(()=>{
            this.CheckDataForCleanup();
        }, intervalTimeMs);
    }

    CheckDataForCleanup(){
        let cleanupObject = {};
        leagueService.LeagueSchemaService.GetAll().then(getAllLeaguesRes => {
            _.each(getAllLeaguesRes, (_league)=>{
                let isDelete = !_league.removedDate && ((new Date() - _league.createdDate) > deleteEntriesOlderThanMS);
                if(isDelete){
                    _league.removedDate = new Date();
                    cleanupObject[_league.league] = _league;
                }
            });

            if(!_.isEmpty(cleanupObject)){
                this.CleanupLeagues(cleanupObject);
            }

        }).catch(getAllleaguesErr => {
            Logger.NodeLogger.log({
                level : 'error',
                message: `CleanupService getAllleaguesErr(), Error: ${getAllleaguesErr}`
            });
        });
    }

    CleanupLeagues(leaguesObject){
        _.each(leaguesObject, (_league, key)=>{
            this.CreateExcelDocForLeague(_league.league).then(createExcelRes =>{
                playersService.PlayersSchemaService.DeleteByLeague(key).then(deleteLeaguePlayersRes => {
                    teamsService.TeamsSchemaService.DeleteByLeague(key).then(deleteLeagueTeamsRes => {
                        picksService.PicksSchemaService.DeleteByLeague(key).then(deleteLeaguePicksRes => {
                            leagueService.LeagueSchemaService.Update(_league).then(updateLeagueRes => {
                                
                            }).catch(updateLeagueErr => {
                                Logger.NodeLogger.log({
                                    level : 'error',
                                    message: `CleanupService CleanupLeagues(), Error: ${updateLeagueErr}`
                                });
                            });
                        }).catch(deleteLeaguePicksErr => {
                            Logger.NodeLogger.log({
                                level : 'error',
                                message: `CleanupService CleanupLeagues(), Error: ${deleteLeaguePicksErr}`
                            });
                        });
                    }).catch(deleteLeagueTeamsErr => {
                        Logger.NodeLogger.log({
                            level : 'error',
                            message: `CleanupService CleanupLeagues(), Error: ${deleteLeagueTeamsErr}`
                        });
                    });
                }).catch(deleteLeaguePlayersErr => {
                    Logger.NodeLogger.log({
                        level : 'error',
                        message: `CleanupService CleanupLeagues(), Error: ${deleteLeaguePlayersErr}`
                    });
                });
            }).catch(createExcelErr => {
                Logger.NodeLogger.log({
                    level : 'error',
                    message: `CleanupService CleanupLeagues(), Error: ${createExcelErr}`
                });
            });
        });
    }

    CreateExcelDocForLeague(leagueName){
        return exportService.ExportService.GetDraftResults(leagueName);
    }
}

exports.CleanupService = new CleanupService();