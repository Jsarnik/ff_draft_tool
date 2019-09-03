const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const draftSchema = new Schema({
    leagueId: { type: Number, required: true, index: { unique: true }},
    leagueDisplayName: { type: String, required: true, index: { unique: true }},
    round: { type: Number, required: true},
    overall: { type: Number, required: true},
    privateLeagueMemberIds: { type: String, required: true, select: false},
    currentPickTeamId: { type: String, required: true},
    draftOrder: { type: [Number] },
    snakeOrder: {type: [Number] },
    updatedDate: { type : Date, default: null }
});

module.exports = mongoose.model('Draft', draftSchema);