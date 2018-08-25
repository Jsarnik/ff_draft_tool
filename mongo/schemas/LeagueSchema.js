var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeagueSchema = new Schema({
    league: { type: String, required: true, index: { unique: true }},
    displayName: { type: String, required: true, index: { unique: true }},
    owner: { type: String, required: true},
    password: { type: String, required: false },
    salt: { type: String, required: false },
    hash: { type: String, required: false }
});

module.exports = mongoose.model('League', LeagueSchema);