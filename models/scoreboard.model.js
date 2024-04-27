const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreboardSchema = new Schema({
    users: [{
        userId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
        userName: { type: String, required: true }, 
        score: { type: Number, required: true, default: 0 }
    }]
});

const ScoreboardModel = mongoose.model('Scoreboard', scoreboardSchema, 'scoreboard');

module.exports = ScoreboardModel;


