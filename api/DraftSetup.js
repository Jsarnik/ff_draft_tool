"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash'),
axios = require('axios'),
draftService = require('../mongo/DraftSettingsService'),
picksService = require('../mongo/PicksService'),
Constants = require('../Constants'),
Logger = require('../Logger');

class DraftSetup{
    async InitializeESPNData(_leagueId, _cookies){
        try{
            const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/${_leagueId}?view=draftInit&view=mSettings&view=kona_player_info&view=modular&view=mNav`,
            options = {
                headers: {
                    'Cookie': `espn_s2=${_cookies.espnS2}; SWID=${_cookies.SWID};`
                },
                withCredentials: true
            };

            let espnResponse = await axios.get(url, {headers: options.headers, withCredentials: true})
                .then(axiosRes => {return axiosRes})
                .catch(axiosErr => {return {error: axiosErr}})

            if(espnResponse.error){
                return Promise.reject(axiosRes.error);
            }

            let model = espnResponse.data;
            const positionsMap = Constants.slotCategoryIdToPositionMap,
            teamMap = Constants.nflTeamIdToNFLTeam,
            teamAbbr = Constants.nflTeamIdToNFLTeamAbbreviation;

            let draftedPlayers = await picksService.PicksService.GetPicksByLeague(_leagueId)
                .then(picksRes => {return picksRes})
                .catch(picksErr => {return {error: picksErr}});

            if(draftedPlayers.error){
                draftedPlayers = [];
            }

            model.players = _.map(model.players, o =>{
                o.player.owned = !_.isEmpty(draftedPlayers[o.player.id]);
                o.player.defaultPositionName = positionsMap[o.player.defaultPositionId];
                o.player.teamName = teamMap[o.player.proTeamId];
                o.player.teamAbbr = teamAbbr[o.player.proTeamId];
                o.espnRank = o.player.draftRanksByRankType && o.player.draftRanksByRankType['PPR'] ? o.player.draftRanksByRankType['PPR'].rank : 10000;
                return o;
            });

            let memberIdsString = _.map(model.members, 'id').join(";");

            const draftModel = {
                leagueId: model.id,
                leagueDisplayName: model.settings.name,
                round: 1,
                overall: 1,
                privateLeagueMemberIds: memberIdsString,
                currentPickTeamId: model.settings.draftSettings.pickOrder[0],
                draftOrder: model.settings.draftSettings.pickOrder,
                snakeOrder: this.CalculateDraftOrder(model.settings.draftSettings.pickOrder),
                updatedDate: new Date()
            }

            let draftModelRes = await draftService.DraftSettingsService.TryCreate(draftModel, _cookies.SWID)
                .then(draftModelMongoRes  => {return draftModelMongoRes})
                .catch(draftModelErr => {return {error: draftModelErr}});

            if(draftModelRes.error){
                return Promise.reject(draftModelRes.error);
            }

            if(!_.isEqual(draftModelRes.draftOrder, draftModel.draftOrder)){
                let updatedDraftModelRes = await draftService.DraftSettingsService.UpdateByLeague(draftModel, draftModel.leagueId, _cookies.SWID)
                    .then(updatedDraftModelRes => {return updatedDraftModelRes})
                    .catch(updatedDraftModelErr => {return {error: updatedDraftModelErr}});

                if(updatedDraftModelRes.error){
                    return Promise.reject(updatedDraftModelRes.error);
                }
            }else{
                return Promise.resolve(model);
            }
        }catch(ex){
            return Promise.reject(ex);
        }
    }

    CalculateDraftOrder(draftOrder){
        try{
            const rounds = 16;
            let fullOrder = [],
            r = _.reverse(_.cloneDeep(draftOrder));
            
            for(let i = 1; i < rounds; i++){
                let round = i % 2 == 0 ? r : draftOrder;
                fullOrder = _.concat(fullOrder, round)
            }
            return fullOrder;
        }catch(ex){
            return ex;
        }        
    }
}



exports.DraftSetup = new DraftSetup();