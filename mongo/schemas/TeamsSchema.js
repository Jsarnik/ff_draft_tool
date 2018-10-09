var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamsSchema = new Schema({
    league: { type: String, required: true},
    name: { type: String, required: true},
    displayName: { type: String, required: true },
    owner: { type: String, required: false },
    draftPos: { type: Number, required: false }
});

module.exports = mongoose.model('Team', TeamsSchema);