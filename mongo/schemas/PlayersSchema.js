var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayersSchema = new Schema({
    rank: { type: Number, required: true, index: { unique: true }},
    name: { type: String, required: true },
    team: { type: String, required: true },
    pos: { type: String, required: false },
    bye: { type: Number, required: false },
    best: { type: Number, required: false },
    worst: {type: Number, required: false},
    avg: {type: Number, required: false},
    isDrafted: { type: Boolean, required: true, default: false },
    draftedByUser: { type: String, required: false},
    roundDrafted: {type: Number, required: false},
    overall: {type: Number, required: false}
});

module.exports = mongoose.model('Player', PlayersSchema);