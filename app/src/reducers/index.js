import { combineReducers } from 'redux';
import league from './leagueReducer';
import players from './playersReducer';
import routes from './routesReducer';
import data from './dataReducer';
import espn from './espnReducer';
import user from './userReducer';
import draft from './draftReducer';

const rootReducer = combineReducers({
    routes,
    data,
    league,
    players,
    espn,
    user,
    draft
});

export default rootReducer;