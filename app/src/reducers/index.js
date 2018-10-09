import { combineReducers } from 'redux';
import league from './leagueReducer';
import teams from './teamsReducer';
import players from './playersReducer';
import routes from './routesReducer';
import data from './dataReducer';

const rootReducer = combineReducers({
    routes,
    data,
    league,
    teams,
    players
});

export default rootReducer;