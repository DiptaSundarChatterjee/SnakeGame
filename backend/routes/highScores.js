const router = require('express').Router();
let HighScore = require('../models/highScore.model');

router.route('/').get((req, res) => {
  HighScore.find()
    .then(highScores => res.json(highScores))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const score = Number(req.body.score);

  const newHighScore = new HighScore({ username, score });

  newHighScore.save()
    .then(() => res.json('High Score added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
