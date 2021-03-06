"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express'),
Constants = require('../Constants'),
 _ = require('lodash'),
 axios = require('axios'),
 draftService = require('../mongo/DraftSettingsService'),
 picksService = require('../mongo/PicksService'),
 draftSetup = require('./DraftSetup'),
 weeklyreportCard = require('./WeeklyReportCard');

var playersService = require('../mongo/PlayersService');
var teamsService = require('../mongo/TeamsService');
var leagueService = require('../mongo/LeagueService');
var importService = require('../ImportService');
var exportService = require('../ExportService');
var async = require('async');

function configure(app) {
    var router = express.Router();
    // Register all our routes with /api
    app.use('/api', router);

    // Routes
    router.post('/upload', uploadFile);
    router.post('/addTeam', addTeam);
    router.post('/updateTeam', updateTeam);
    router.post('/deleteTeam', deleteTeam);
    router.post('/draftPlayer', draftPlayer);
    router.post('/unDraftPlayer', unDraftPlayer);
    router.post('/getTeamRoster', getTeamRoster);
    router.post('/addLeague', addLeague);
    router.post('/getLeague', getLeague);
    router.post('/updateLeague', updateLeague);
    router.post('/getTeams', getTeams);
    router.post('/getPlayers', getPlayers);
    router.post('/resetDB', resetDB);
    router.get('/downloadDraft', downloadDraft);

    // NEW
    router.post('/userESPNInfo', userESPNInfo)
    router.post('/weeklyReportCard', weeklyReportCard);
    router.post('/privateLeague', privateLeague);
    router.post('/getPositions', getPositions);
    router.post('/getNFLTeams', getNFLTeams);
    router.post('/getDraftSettings', getDraftSettings);
    router.post('/setDraftPick', setDraftPick);
    router.post('/setDraftOrder', setDraftOrder);
    router.post('/getDraftedPlayers', getDraftedPlayers);

    function userESPNInfo(req, res, next){
        try{
            const url = `https://fan.api.espn.com/apis/v2/fans/${req.body.swid}`;

            axios.get(url, {})
                .then(axiosRes => {
                    let _data = axiosRes.data,
                    fantasyTeams = _.filter(_data.preferences, o=>{
                        return o.type.code.toLowerCase() === 'fantasy' && o.metaData.entry.abbrev.toLowerCase() === 'ffl';
                    });
                    _data.leaguesModel = _.map(fantasyTeams, meta => {
                        return {label: `${meta.metaData.entry.entryLocation}${meta.metaData.entry.entryNickname} (${meta.metaData.entry.groups[0].groupName})`, value: meta.metaData.entry.groups[0].groupId}
                    })
                    res.json(_data)
                })
                .catch(axiosErr => {
                    res.json({failed: axiosErr});
                });

        }catch(ex){
            res.status(500);
            res.json({failed: ex});
        }
    }

    function weeklyReportCard(req, res, next){
        try{
            const cookies = req.body.cookies || {
                espnS2: process.env.espnS2,
                SWID: process.env.SWID
            };
            weeklyreportCard.WeeklyReportCardService.WeeklyReportCard(req.body.leagueId, cookies, req.body.selectedMatchupPeriod)
            .then(weeklyCardRes => {
                res.json(weeklyCardRes);
            })
            .catch(weeklyCardErr => {
                res.json({failed: weeklyCardErr});
            });   
        }catch(ex){
            res.status(500);
            res.json({failed: ex});
        }
    };

    function privateLeague(req, res, next){
        try{
            draftSetup.DraftSetup.InitializeESPNData(req.body.leagueId, req.body.cookies)
            .then(draftRes => {
                res.json(draftRes);
            })
            .catch(draftErr => {
                res.json({failed: draftErr});
            });
        }catch(ex){
            res.status(500);
            res.json({failed: ex});
        }
    };

    function setDraftOrder(req, res, next){
        res.status(200);
        draftService.DraftSettingsService.UpdateByLeague(req.body.draftModel, req.body.leagueId, req.body.memberId).then(draftModelRes => {
            draftModelRes.fullDraftOrder = draftSetup.DraftSetup.CalculateDraftOrder(draftModelRes.draftOrder);
            res.json(draftModelRes);
        }).catch(err => {
            res.json({failed: err})
        });
    }

    function getDraftSettings(req, res, next){
        res.status(200);
        draftService.DraftSettingsService.GetByLeague(req.body.leagueId, req.body.memberId).then(draftModelRes => {
            draftModelRes.fullDraftOrder = draftSetup.DraftSetup.CalculateDraftOrder(draftModelRes.draftOrder);
            res.json(draftModelRes);
        }).catch(err => {
            res.json({failed: err})
        });
    }

    function getDraftedPlayers(req, res, next){
        res.status(200);
        picksService.PicksService.GetPicksByLeague(req.body.leagueId).then(picksModelRes => {
            res.json(picksModelRes);
        }).catch(err => {
            res.json({failed: err})
        });
    }

    function getPositions(req, res, next){
        res.status(200);
        res.json(req.body.isDraft ? Constants.draftPosDropDown :  Constants.slotCategoryIdToPositionMap);
    }

    function getNFLTeams(req, res, next){
        res.status(200);
        const nflTeamListMap = req.body.isDraft ? Constants.nflTeamDropDown : Constants.nflTeamIdToNFLTeam;
        let nflTeamsMap = {};

        _.each(nflTeamListMap, (teamName,i) => {
            nflTeamsMap[i] = {
                name: teamName,
                abbr: Constants.nflTeamIdToNFLTeamAbbreviation[i]
            }
        });
        res.json(nflTeamsMap);
    }

    function setDraftPick(req, res, next){
        res.status(200);
        let pickModel = req.body.pickModel;
        picksService.PicksService.TryCreate(pickModel)
        .then(pickModelRes => {
            draftService.DraftSettingsService.GetByLeague(pickModel.leagueId, pickModel.memberId)
            .then(draftModelRes => {     
                draftModelRes.round+=1;
                draftModelRes.overall+=1;
                draftModelRes.currentPickTeamId = draftModelRes.snakeOrder[draftModelRes.overall-1];

                draftService.DraftSettingsService.UpdateByLeague(draftModelRes, pickModel.leagueId, pickModel.memberId)
                .then(updateDraftModelRes => {
                    res.json(updateDraftModelRes);
                })
                .catch(updateDraftModelErr => {
                    res.json({failed: updateDraftModelErr});
                })
            })
            .catch(draftModelErr => {
                res.json({failed: draftModelErr});
            });
        })
        .catch(pickModelErr => {
            res.json({failed: pickModelErr});
        });
    }

























    function uploadFile(req, res, next){
        let imageFile = req.files.file;
      
        imageFile.mv(`${__dirname}/public/${req.body.filename}.csv`, function(err) {
          if (err) {
            return res.status(500).send(err);
          }
      
          res.json({file: `public/${req.body.filename}.jpg`});
        });
      
    };

    function addLeague(req, res, next){
        res.status(200);

        let leagueObject = req.body.leagueObject;
        leagueObject.league = leagueObject.displayName.replace(' ', '_');

        leagueService.LeagueSchemaService.Create(leagueObject).then((response)=>{
            let _league = response;
            importService.ImportService.UploadFile(leagueObject.league).then((uploadResponse)=>{
                res.json({data: {league: _league, success: 'Successfully imported player data for your league.'}});
            }).catch((uploadErr)=>{
                res.json({data: {error: uploadErr}});
            });
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    };

    function getLeague(req, res, next){
        res.status(200);

        leagueService.LeagueSchemaService.GetByLeague(req.body.leagueObject.league).then((response)=>{
            res.json({data: response});
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    };

    function getPlayers(req, res, next){
        res.status(200);

        playersService.PlayersSchemaService.GetAll(req.body.league).then((response)=>{
            res.json({data: response});
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    };

    function getTeams(req, res, next){
        res.status(200);

        teamsService.TeamsSchemaService.GetAll(req.body.league).then((teamsResponse)=>{
            async.each(teamsResponse, (team, next)=>{
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
                    res.json({data: {error: asyncErr}});
                }else{
                    res.json({data: teamsResponse});
                }
            });
        }).catch((teamsErr)=>{
            res.json({data: {error: teamsErr}});
        });
    };

    function draftPlayer(req, res, next){
        res.status(200);

        let draftOptions = req.body.draftOptions;
        let pickOptions = {
            league: draftOptions.league,
            teamName: draftOptions.draftedByUser,
            playerId: draftOptions.id,
            roundDraft: draftOptions.roundDrafted,
            overall: draftOptions.overall
        }

        playersService.PlayersSchemaService.Update(draftOptions).then((draftResponse)=>{
            picksService.PicksSchemaService.Create(pickOptions).then((pickResponse) => {
                res.json({data: {success:'Successfully Drafted.'}});
            }).catch((pickErr) => {
                res.json({data: {error: pickErr}});
            });
        }).catch((draftErr)=>{
            res.json({data: {error: draftErr}});
        });
    };

    function unDraftPlayer(req, res, next){
        res.status(200);

        let unDraftOptions = req.body.unDraftOptions;
        let deletePick = {
            teamName: unDraftOptions.draftedByUser,
            playerId: unDraftOptions.id,
            league: unDraftOptions.league
        }

        playersService.PlayersSchemaService.Update(unDraftOptions).then((unDraftResponse)=>{
            picksService.PicksSchemaService.Delete(deletePick).then((deletePickResponse) => {
                res.json({data: {success:'Successfully UnDrafted.'}});
            }).catch((deletePickErr)=>{
                res.json({data: {error: deletePickErr}});
            });
        }).catch((unDraftErr)=>{
            res.json({data: {error: unDraftErr}});
        });
    };

    
    function getTeamRoster(req, res, next){
        res.status(200);
        playersService.PlayersSchemaService.GetByDraftedUser(req.body.leagueName, req.body.teamName).then((response)=>{
            res.json({data: response});
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    };

    function addTeam(req, res, next){
        res.status(200);

        leagueService.LeagueSchemaService.GetByLeague(req.body.teamObject.league).then((leagueResponse)=>{
            if(leagueResponse.league){
                teamsService.TeamsSchemaService.TryCreate(req.body.teamObject).then((response)=>{
                    res.json({data: response});
                }).catch((err)=>{
                    res.json({data: {error: err}});
                });
            }else{
                res.json({data: {error: `Can't find league ${req.body.teamObject.league}`}});
            }
        }).catch((leagueErr)=>{
            res.json({data: {error: leagueErr}});
        });
    };

    function updateTeam(req, res, next){
        res.status(200);

        leagueService.LeagueSchemaService.GetByLeague(req.body.teamObject.league).then((leagueResponse)=>{
            if(leagueResponse.league){
                if(req.body.keyChangeRequiresDelete){
                    teamsService.TeamsSchemaService.CreateAndDelete(req.body.teamObject, req.body.keyChangeRequiresDelete).then((response)=>{
                        res.json({data: response});
                    }).catch((err)=>{
                        res.json({data: {error: err}});
                    });
                }else{
                    teamsService.TeamsSchemaService.Update(req.body.teamObject).then((response)=>{
                        res.json({data: response});
                    }).catch((err)=>{
                        res.json({data: {error: err}});
                    });
                }
            }else{
                res.json({data: {error: `Can't find league ${req.body.teamObject.league}`}});
            }
        }).catch((leagueErr)=>{
            res.json({data: {error: leagueErr}});
        });
    }

    function deleteTeam(req, res, next){
        res.status(200);

        teamsService.TeamsSchemaService.Delete(req.body.teamObject).then((response)=>{
            res.json({data: response});
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    };

    function updateLeague(req, res, next){
        res.status(200);

        leagueService.LeagueSchemaService.Update(req.body.leagueObject).then((response)=>{
            res.json({data: response._doc});
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    };

    function downloadDraft(req, res, next){
        res.status(200);
        let leagueName = req.query.leagueName;
        let isDownloadOnly = req.query.isDownloadOnly;

        if(leagueName){
            exportService.ExportService.GetDraftResults(leagueName, isDownloadOnly).then((response)=>{
                res.download(response.path, response.fileName);
            }).catch((err)=>{
                res.json({data: {error: err}});
            });
        }else{
            res.json({data: {error: 'No league specified..'}});
        }
    }

    function resetDB(req, res, next){
        res.status(200);

        importService.ImportService.UploadFile(req.body.leagueName).then((response)=>{
            let Picks = require('../mongo/schemas/PicksSchema');
            Picks.remove({league: req.body.leagueName}, (mongoErr) => { 
                if(mongoErr){
                    res.json({data: {error: mongoErr}});
                }else{
                    let r = {success: `${response.success} and removed all picks`};
                    res.json({data: r});
                }
            });
        }).catch((err)=>{
            res.json({data: {error: err}});
        });
    }
}
exports.configure = configure;