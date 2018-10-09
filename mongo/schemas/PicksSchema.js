var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PicksSchema = new Schema({
    league: { type: String, required: true},
    teamName: { type: String, required: true},
    playerId: { type: String, required: true },
    roundDraft: { type: Number, required: false },
    overall: { type: Number, required: false }
});

module.exports = mongoose.model('Picks', PicksSchema);