"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var playersService = require('../mongo/PlayersService');
var picksService = require('../mongo/PicksService');
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
    router.post('/deleteTeam', deleteTeam);
    router.post('/draftPlayer', draftPlayer);
    router.post('/unDraftPlayer', unDraftPlayer);
    router.post('/getTeamRoster', getTeamRoster);
    router.post('/addLeague', addLeague);
    router.post('/getLeague', getLeague);
    router.post('/getTeams', getTeams);
    router.post('/getPlayers', getPlayers);
    router.post('/resetDB', resetDB);
    router.post('/downloadDraft', downloadDraft);

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

        leagueService.LeagueSchemaService.Create(leagueObject, (err, response)=>{
            let _league = response.league;
            if(err){
                res.json({data: {error: err}});
            }else{
                importService.ImportService.UploadFile(leagueObject.league, (uploadErr, uploadResponse)=>{
                    if(uploadErr){
                        res.json({data: {error: uploadErr}});
                    }else{
                        res.json({data: {league: _league, success: 'Successfully imported player data for your league.'}});
                    }
                });
            }
        });
    };

    function getLeague(req, res, next){
        res.status(200);

        leagueService.LeagueSchemaService.GetByLeague(req.body.leagueObject.league, (err, response)=>{
            if(err){
                res.json({data: {error: err}});
            }else{
                res.json({data: response});
            }
        });
    };

    function getPlayers(req, res, next){
        res.status(200);

        playersService.PlayersSchemaService.GetAll(req.body.league, (err, response)=>{
            if(err){
                res.json({data: {error: err}});
            }else{
                res.json({data: response});
            }
        });
    };

    function getTeams(req, res, next){
        res.status(200);

        teamsService.TeamsSchemaService.GetAll(req.body.league, (teamsErr, teamsResponse)=>{
            if(teamsErr){
                res.json({data: {error: teamsErr}});
            }else{
                async.each(teamsResponse, (team, next)=>{
                    picksService.PicksSchemaService.GetAllByTeam(team.name, (pickErr, pickResponse)=>{
                        team.picks = {};
                        if(pickResponse){
                            team.picks = pickResponse;
                        }
                        next();
                    });
                }, (asyncErr)=>{
                    if(asyncErr){
                        res.json({data: {error: asyncErr}});
                    }else{
                        res.json({data: teamsResponse});
                    }
                });
            }
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

        playersService.PlayersSchemaService.Update(draftOptions, (draftErr, draftResponse)=>{
            if(draftErr){
                res.json({data: {error: draftErr}});
            }else{
                picksService.PicksSchemaService.Create(pickOptions, (pickErr, pickResponse)=>{
                    if(pickErr){
                        res.json({data: {error: pickErr}});
                    }else{
                        res.json({data: {response:'Successfully Drafted.'}});
                    }
                });
            }
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

        playersService.PlayersSchemaService.Update(unDraftOptions, (unDraftErr, unDraftResponse)=>{
            if(unDraftErr){
                res.json({data: {error: unDraftErr}});
            }else{
                picksService.PicksSchemaService.Delete(deletePick, (deletePickErr, deletePickResponse)=>{
                    if(deletePickErr){
                        res.json({data: {error: deletePickErr}});
                    }else{
                        res.json({data: {response:'Successfully UnDrafted.'}});
                    }
                });
            }
        });
    };

    
    function getTeamRoster(req, res, next){
        res.status(200);
        playersService.PlayersSchemaService.GetByDraftedUser(req.body.teamName, (err, response)=>{
            if(err){
                res.json({data: {error: err}});
            }else{
                res.json({data: response});
            }
        });
    };

    function addTeam(req, res, next){
        res.status(200);

        leagueService.LeagueSchemaService.GetByLeague(req.body.teamObject.league, (leagueErr, leagueResponse)=>{
            if(!leagueErr && leagueResponse.league){
                teamsService.TeamsSchemaService.Create(req.body.teamObject, (err, response)=>{
                    if(err){
                        res.json({data: {error: err}});
                    }else{
                        res.json({data: response});
                    }
                });
            }else{
                res.json({data: {error: leagueErr}});
            }
        });
    };

    function deleteTeam(req, res, next){
        res.status(200);

        teamsService.TeamsSchemaService.Delete(req.body.teamObject, (err, response)=>{
            if(err){
                res.json({data: {error: err}});
            }else{
                res.json({data: response});
            }
        });
    };
    

    function downloadDraft(req, res, next){
        res.status(200);

        exportService.ExportService.GetDraftResults((err, response)=>{
            if(err){
                res.json({data: {error: err}});
            }else{
                res.json({data: response});
            }
        });
    }

    function resetDB(req, res, next){
        res.status(200);

        importService.ImportService.UploadFile(req.body.leagueName, (err, response)=>{
            if(err){
                res.json({data: {error: err}});
            }else{
                var Picks = require('../mongo/schemas/PicksSchema');
                Picks.remove({league: req.body.leagueName}, function(mongoErr) { 
                    if(mongoErr){
                        res.json({data: {error: mongoErr}});
                    }else{
                        let r = {success: `${response.success} and removed all picks`};
                        res.json({data: r});
                    }
                });
            }

        });
    }
}
exports.configure = configure;