const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/snake-game', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const highScoresRouter = require('./routes/highScores');

app.use('/highScores', highScoresRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
