const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const highScoreSchema = new Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
}, {
  timestamps: true,
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

module.exports = HighScore;
