"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client = require('espn-fantasy-football-api/node').Client,
_ = require('lodash'),
moment = require('moment'),
axios = require('axios'),
Logger = require('../Logger');

class WeeklyReportCardService{
    async WeeklyReportCard(_leagueId, _cookies){
        try{
           let leagueInfo = await this.GetLeagueInfo(_leagueId, _cookies)
                                   .then(teamsRes => { return teamsRes })
                                   .catch(teamsErr => { return {error: teamsErr} });
                                
            if(leagueInfo.error){
                return Promise.reject(memberTeams.error);
            }

           let boxScores = await this.GetBoxScores(_leagueId, _cookies, leagueInfo)
                                 .then(boxScoreRes => { return boxScoreRes })
                                 .catch(boxScoreErr => { return {error: boxScoreErr} });

            if(boxScores.error){
                return Promise.reject(boxScores.error);
            }

            return Promise.resolve({
                stats: boxScores, 
                leagueInfo: leagueInfo
            });
        }catch(ex){
            return Promise.reject(ex);
        }
    }

    async GetBoxScores(_leagueId, _cookies, _leagueInfo){
        try{
            const myClient = new Client({ leagueId: _leagueId }),
            momentDate = moment();
            myClient.setCookies({ espnS2: _cookies.espnS2, SWID: _cookies.SWID });
    
            const year = _leagueInfo.seasonId,
            periods = {
                currentPeriod: _leagueInfo.status.currentMatchupPeriod,
                previousPeriod: _leagueInfo.status.currentMatchupPeriod - 1 || 1
            }; 
          
            let currentBoxScores = await myClient.getBoxscoreForWeek({ seasonId: year, scoringPeriodId: periods.currentPeriod, matchupPeriodId: periods.currentPeriod })
                                  .then(boxscores => {
                                      return boxscores;
                                  }).catch(err=>{
                                      return {error: err}
                                  });
    
            if(currentBoxScores && currentBoxScores.error){
                return Promise.reject(currentBoxScores.error);
            }
    
            let previousBoxScores = periods.previousPeriod !== periods.currentPeriod ? await myClient.getBoxscoreForWeek({ seasonId: year, scoringPeriodId: periods.previousPeriod, matchupPeriodId: periods.previousPeriod })
                                   .then(boxscores => {
                                       return boxscores;
                                   }).catch(err=>{
                                       return {error: err}
                                   }) : null;
                                   
            if(previousBoxScores && previousBoxScores.error){
                return Promise.reject(previousBoxScores.error);
            }                   
    
            let reportCard = await this.CompareBoxScores(currentBoxScores, previousBoxScores, _leagueInfo.teams);
            
            if(reportCard.error){
                return Promise.reject(reportCard.error);
            }
    
            return Promise.resolve(reportCard);
        }catch(ex){
            return Promise.reject(ex);
        }
    }

    async GetLeagueInfo(_leagueId, _cookies){
        const year = moment().year();
        const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${_leagueId}?view=mTeam&view=mStandings&view=mSettings`,
        options = {
            headers: {
                'Cookie': `espn_s2=${_cookies.espnS2}; SWID=${_cookies.SWID};`
            },
            withCredentials: true
        },
        espnResponse = await axios.get(url, {headers: options.headers, withCredentials: true})
                    .then(axiosRes => {return axiosRes.data})
                    .catch(axiosErr => {return {error: axiosErr}});

        if(espnResponse.error){
            return Promise.reject(axiosRes.error);
        }

        return Promise.resolve(espnResponse);
    }

    async GetScoringPeriod(year){
        const dateString = '2018-11-18';

        try{
            const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}?view=proTeamSchedules`,
            options = {};
            let scoringPeriods,
            currentPeriod,
            previousPeriod,
            startOfWeekTime = new Date(moment(dateString).startOf('week')).getTime(),
            endOfWeek = new Date(moment(dateString).endOf('week')).getTime(),
            espnResponse = await axios.get(url, options)
                .then(axiosRes => {return axiosRes})
                .catch(axiosErr => {return {error: axiosErr}});

            if(espnResponse.error){
                return Promise.reject(axiosRes.error);
            }

            scoringPeriods = espnResponse.data.settings.proTeams[0].proGamesByScoringPeriod,
            currentPeriod = parseInt(_.findKey(scoringPeriods, o => {
                return o[0].date >= startOfWeekTime && o[0].date <= endOfWeek;
            }) || 1),
            previousPeriod = currentPeriod === 1 ? 1 : currentPeriod - 1;
            return Promise.resolve({currentPeriod, previousPeriod});
        }catch(ex){
            return Promise.reject(ex);
        }
    }


    CompareBoxScores(currentBoxScores, previousBoxScores, teams){
        try{
            // let reportCardModel = {
            //     mostPointsModel: {
            //         text: 'Most Points Scored.',
            //         teamIds: [],
            //         pts: Number.NEGATIVE_INFINITY,
            //         list: {}
            //     },
            //     leastPointsModel:{
            //         text: 'Least Points Scored.',
            //         teamIds: [],
            //         pts: Number.POSITIVE_INFINITY,
            //         list: {}
            //     },
            //     narrowistMargin: {
            //         text: 'Narrowist Win.',
            //         margin: Number.POSITIVE_INFINITY,
            //         teams: [],
            //         list: {}
            //     },
            //     greatestMargin: {
            //         text: 'Largest Margin Win.',
            //         margin: Number.NEGATIVE_INFINITY,
            //         teams: [],
            //         list: {}
            //     },
            //     pointsOnBench: {
            //         text: 'Most points left on bench.',
            //         teamIds: [],
            //         pts: Number.NEGATIVE_INFINITY,
            //         list: {}
            //     },
            //     greatestPositivePointDiff: {
            //         text: 'Greatest increase in points from previous week.',
            //         teamIds: [],
            //         scores: [],
            //         diff: Number.NEGATIVE_INFINITY,
            //         list: {}
            //     },
            //     greatestNegativePointDiff: {
            //         text: 'Greates decrease in points from previous week.',
            //         teamIds: [],
            //         scores: [],
            //         diff: Number.POSITIVE_INFINITY,
            //         list: {}
            //     }
            // };

            let teamsModel = {},
            prevWeekTeams = previousBoxScores ? this.SplitBoxScores(previousBoxScores) : null;

            _.each(currentBoxScores, matchup => {
                let prevHomeModel = prevWeekTeams ? _.find(prevWeekTeams, {teamId: matchup.homeTeamId}) : null,
                prevAwayModel = prevWeekTeams ? _.find(prevWeekTeams, {teamId: matchup.awayTeamId}) : null;

                teamsModel[matchup.homeTeamId] = {
                    id: matchup.homeTeamId,
                    oppId: matchup.awayTeamId,
                    info: _.find(teams, {'id': matchup.homeTeamId}),
                    totalPts: matchup.homeScore,
                    margin: matchup.homeScore - matchup.awayScore,
                    ptsLeftOnBench: this.GetPointsOnBench(matchup.homeRoster),
                    previous: prevHomeModel ? {
                        score: prevHomeModel.score,
                        diff: matchup.homeScore - prevHomeModel.score
                    } : null
                };

                teamsModel[matchup.awayTeamId] = {
                    id: matchup.awayTeamId,
                    oppId: matchup.homeTeamId,
                    info: _.find(teams, {'id': matchup.awayTeamId}),
                    totalPts: matchup.awayScore,
                    margin: matchup.awayScore - matchup.homeScore,
                    ptsLeftOnBench: this.GetPointsOnBench(matchup.awayRoster),
                    previous: prevAwayModel ? {
                        score: prevAwayModel.score,
                        diff: matchup.homeScore - prevAwayModel.score
                    } : null
                }

                // reportCardModel.mostPointsModel = this.GetMostPoints(matchup, reportCardModel.mostPointsModel);
                // reportCardModel.leastPointsModel = this.GetLeastPoints(matchup, reportCardModel.leastPointsModel);
                // reportCardModel.narrowistMargin = this.GetNarrowistMargin(matchup, reportCardModel.narrowistMargin);
                // reportCardModel.greatestMargin = this.GetGreatestMargin(matchup, reportCardModel.greatestMargin);
                // reportCardModel.pointsOnBench = this.GetPointsOnBench(matchup.homeTeamId, matchup.homeRoster, reportCardModel.pointsOnBench);
                // reportCardModel.pointsOnBench = this.GetPointsOnBench(matchup.awayTeamId, matchup.awayRoster, reportCardModel.pointsOnBench);
            });

            // if(previousBoxScores){
            //     let currentWeek = this.SplitBoxScores(currentBoxScores),
            //     prevWeek = this.SplitBoxScores(previousBoxScores),
            //     teams = _.map(currentWeek, t => {
            //         return t = {
            //             curr: t,
            //             prev: prevWeek[t.teamId]
            //         }
            //     });

            //     _.each(teams, team => {
            //         reportCardModel.greatestPositivePointDiff = this.GetGreatestPointIncrease(team, reportCardModel.greatestPositivePointDiff);
            //         reportCardModel.greatestNegativePointDiff = this.GetGreatestPointDecrease(team, reportCardModel.greatestNegativePointDiff);
            //     })
            // }

            return teamsModel;
        }catch(ex){
            return ex;
        }        
    }

    SplitBoxScores(boxScores){
        let model = {};
        try{
            _.each(boxScores, box => {
                model[box.homeTeamId] = {
                    teamId: box.homeTeamId,
                    score: box.homeScore,
                    roster: box.homeRoster
                };
                model[box.awayTeamId] = {
                    teamId: box.awayTeamId,
                    score: box.awayScore,
                    roster: box.awayRoster
                };
            });
        }catch(ex){
            console.log(ex)
        }

        return model;
    }
    
    GetMostPoints(matchup, model){
        try{
            let mostPtsMatchModel = matchup.homeScore > matchup.awayScore ? {pts: matchup.homeScore, teamId: [matchup.homeTeamId]} : {pts: matchup.awayScore, teamId: [matchup.awayTeamId]};
                
            if(mostPtsMatchModel.pts === model.pts){
                model.pts = mostPtsMatchModel.pts;
                model.teamIds.push(mostPtsMatchModel.teamId)
            }

            if(mostPtsMatchModel.pts > model.pts){
                model.pts = mostPtsMatchModel.pts;
                model.teamIds = mostPtsMatchModel.teamId;
            }

            model.list[matchup.awayTeamId] = matchup.awayScore;
            model.list[matchup.homeTeamId] = matchup.homeScore;
        }
        catch(ex){
            console.log(ex);
        }finally{
            return model;
        }
        
    }

    GetLeastPoints(matchup, model){
        try{
            let mostPtsMatchModel = matchup.homeScore < matchup.awayScore ? {pts: matchup.homeScore, teamId: [matchup.homeTeamId]} : {pts: matchup.awayScore, teamId: [matchup.awayTeamId]};
                    
            if(mostPtsMatchModel.pts === model.pts){
                model.pts = mostPtsMatchModel.pts;
                model.teamIds.push(mostPtsMatchModel.teamId)
            }

            if(mostPtsMatchModel.pts < model.pts){
                model.pts = mostPtsMatchModel.pts;
                model.teamIds = mostPtsMatchModel.teamId;
            }

            model.list[matchup.awayTeamId] = matchup.awayScore;
            model.list[matchup.homeTeamId] = matchup.homeScore;
        }
        catch(ex){
            console.log(ex);
        }finally{
            return model;
        }
    }

    GetNarrowistMargin(matchup, model){
        try{
            let margin = Math.abs(matchup.homeScore - matchup.awayScore);

            if(margin === model.margin){
                model.margin = margin;
                model.teams.push({
                    home: {id: matchup.homeTeamId, score: matchup.homeScore},
                    away: {id: matchup.awayTeamId, score: matchup.awayScore}
                });
            }

            if(margin < model.margin){
                model.margin = margin;
                model.teams = [{
                    home: {id: matchup.homeTeamId, score: matchup.homeScore},
                    away: {id: matchup.awayTeamId, score: matchup.awayScore}
                }];
            }

            model.list[`${matchup.awayTeamId}_${matchup.homeTeamId}`] = margin;
        }
        catch(ex){
            console.log(ex);
        }finally{
            return model;
        }
    }

    GetGreatestMargin(matchup, model){
        try{
            let margin = Math.abs(matchup.homeScore - matchup.awayScore);

            if(margin === model.margin){
                model.margin = margin;
                model.teams.push({
                    home: {id: matchup.homeTeamId, score: matchup.homeScore},
                    away: {id: matchup.awayTeamId, score: matchup.awayScore}
                });
            }

            if(margin > model.margin){
                model.margin = margin;
                model.teams = [{
                    home: {id: matchup.homeTeamId, score: matchup.homeScore},
                    away: {id: matchup.awayTeamId, score: matchup.awayScore}
                }];
            } 

            model.list[`${matchup.awayTeamId}_${matchup.homeTeamId}`] = margin;
        }
        catch(ex){
            console.log(ex);
        }finally{
            return model;
        }
    }

    GetPointsOnBench(roster){
        try{
            let active =  _.reject(roster, ['position', 'Bench']),
            bench = _.filter(roster, ['position', 'Bench']),
            benchedPtsDiff = 0;

            _.each(bench, b => {
                let eligable = b.player.eligiblePositions,
                replacementsOptions = _.filter(active, a => {
                    return !a.isReplaced && eligable.indexOf(a.position) !== -1 && b.totalPoints > a.totalPoints;   
                });

                if(!_.isEmpty(replacementsOptions)){
                    let replace = _.minBy(replacementsOptions, r => {
                        return r.totalPoints;
                    });
    
                    benchedPtsDiff+=Math.abs(b.totalPoints - replace.totalPoints);
                    replace.isReplaced = true;
                }
            });
            return benchedPtsDiff;
        }
        catch(ex){
            return 0;
        }
    }

    GetGreatestPointIncrease(team, model){
        try{
            let diff = team.curr.score - team.prev.score;
            if(diff === model.diff){
                model.teamIds.push(team.curr.teamId);
                model.scores.push({
                    [team.curr.teamId]: {score: [team.curr.score, team.prev.score]}
                });
            }

            if(diff > model.diff){
                model.diff = diff;
                model.teamIds = [team.curr.teamId];
                model.scores = {
                    [team.curr.teamId]: {score: [team.curr.score, team.prev.score]}
                };
            }

            model.list[team.curr.teamId] = diff;
        }catch(ex){
            console.log(ex);
        }finally{
            return model;
        }
    }

    GetGreatestPointDecrease(team, model){
        try{
            let diff = team.curr.score - team.prev.score;
            if(diff === model.diff){
                model.teamIds.push(team.curr.teamId);
                model.scores.push({
                    [team.curr.teamId]: {score: [team.curr.score, team.prev.score]}
                });
            }

            if(diff < model.diff){
                model.diff = diff;
                model.teamIds = [team.curr.teamId];
                model.scores = {
                    [team.curr.teamId]: {score: [team.curr.score, team.prev.score]}
                };
            }

            model.list[team.curr.teamId] = diff;
        }catch(ex){
            console.log(ex);
        }finally{
            return model;
        }
    }

}




exports.WeeklyReportCardService = new WeeklyReportCardService();