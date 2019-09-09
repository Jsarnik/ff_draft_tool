"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client = require('espn-fantasy-football-api/node').Client,
_ = require('lodash'),
moment = require('moment'),
axios = require('axios'),
Logger = require('../Logger');

class WeeklyReportCardService{
    async WeeklyReportCard(_leagueId, _cookies, _selectedMatchupPeriod){
        try{
           let leagueInfo = await this.GetLeagueInfo(_leagueId, _cookies)
                                   .then(teamsRes => { return teamsRes })
                                   .catch(teamsErr => { return {error: teamsErr} });
                                
            if(leagueInfo.error){
                return Promise.reject(memberTeams.error);
            }

           let boxScores = await this.GetBoxScores(_leagueId, _cookies, leagueInfo, _selectedMatchupPeriod)
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

    async GetBoxScores(_leagueId, _cookies, _leagueInfo, selectedMatchupPeriod){
        try{
            const myClient = new Client({ leagueId: _leagueId }),
            momentDate = moment();
            myClient.setCookies({ espnS2: _cookies.espnS2, SWID: _cookies.SWID });
    
            const year = _leagueInfo.seasonId,
            periods = {
                currentPeriod: selectedMatchupPeriod || _leagueInfo.status.currentMatchupPeriod,
                previousPeriod: (selectedMatchupPeriod || _leagueInfo.status.currentMatchupPeriod) - 1 || 1
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
            });

            return this.GradeTeams(teamsModel);
        }catch(ex){
            return ex;
        }        
    }

    GradeTeams(model){
        try{
            const total = _.orderBy(model, ['totalPts'],['desc']);
            const margin = _.orderBy(model, ['margin'],['desc']);
            const bench = _.orderBy(model, ['ptsLeftOnBench'],['asc']);
            const change = 0;
            const espnRank = _.orderBy(model, o =>{
                return o.info.draftDayProjectedRank - o.info.currentProjectedRank;
            }, ['asc']);
            const teamsCount = Object.keys(model).length;
            const weights = {
                total: 20,  // 20
                margin: 20,  // 20
                bench: 20,   // 20
                change: 20,  // 20
                espnRankChange: 20 // 20 
            }

            _.each(model, teamModel => {
                let total_pts = _.findIndex([...total].reverse(), o=>{ return o.id === teamModel.id}) + 1;
                let margins = _.findIndex([...margin].reverse(), o=>{ return o.id === teamModel.id}) + 1;
                let benched_pts = _.findIndex([...bench].reverse(), o=>{ return o.id === teamModel.id}) + 1;
                let weekly_diff = 0;
                let rank_change = _.findIndex([...espnRank].reverse(), o=>{ return o.id === teamModel.id}) + 1;
                let score = 0;
                let grades = {
                    total_pts: {
                        name: 'Total Points',
                        rank: _.findIndex(total, o=>{ return o.id === teamModel.id}) + 1,
                        multiplier: total_pts,
                        perc: total_pts / teamsCount,
                        val: weights.total * (total_pts / teamsCount),
                        total: 20
                    },
                    margins: {
                        name: 'Win/Loss Margin',
                        rank: _.findIndex(margin, o=>{ return o.id === teamModel.id}) + 1,
                        multiplier: margins,
                        perc: margins / teamsCount,
                        val: weights.margin * (margins / teamsCount),
                        total: 20
                    },
                    benched_pts: {
                        name: 'Pts on Bench',
                        rank: _.findIndex(bench, o=>{ return o.id === teamModel.id}) + 1,
                        multiplier: benched_pts,
                        perc: benched_pts / teamsCount,
                        val: weights.bench * (benched_pts / teamsCount),
                        total: 20
                    },
                    weekly_diff: {
                        name: 'Weekly Pts Change',
                        rank: 1,
                        multiplier: 0,
                        perc: 100,
                        val: 20,
                        total: 20
                    },
                    rank_change: {
                        name: 'Proj Rank Change',
                        rank:  _.findIndex(espnRank, o=>{ return o.id === teamModel.id}) + 1,
                        multiplier: rank_change,
                        perc: rank_change / teamsCount,
                        val: weights.espnRankChange * (rank_change / teamsCount),
                        total: 20
                    }
                }

                _.each(grades, o=>{
                    score+=o.val;
                });
                teamModel.grades = grades;
                teamModel.gradeScore = score;
            });
        }catch(ex){
            console.log(ex);
        }finally{
            return model;
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