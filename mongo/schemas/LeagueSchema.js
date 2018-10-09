var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeagueSchema = new Schema({
    league: { type: String, required: true, index: { unique: true }},
    displayName: { type: String, required: true, index: { unique: true }},
    owner: { type: String, required: true},
    password: { type: String, required: false },
    salt: { type: String, required: false },
    hash: { type: String, required: false },
    teamCount: { type: Number, required: true, default: 10},
    createdDate: { type : Date, default: Date.now },
    removedDate: { type : Date, default: null }
});

module.exports = mongoose.model('League', LeagueSchema);