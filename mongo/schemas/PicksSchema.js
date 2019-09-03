const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picksSchema = new Schema({
    leagueId: { type: Number, required: true, select: false},
    memberId: { type: String, required: true, select: false},
    playerId: { type: Number, required: true},
    round: { type: Number, required: true},
    overall: { type: Number, required: true}
});

module.exports = mongoose.model('Picks', picksSchema);