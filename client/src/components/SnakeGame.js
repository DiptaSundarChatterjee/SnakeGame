import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const interval = setInterval(moveSnake, 100);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    window.addEventListener('keydown', changeDirection);
    return () => window.removeEventListener('keydown', changeDirection);
  });

  useEffect(() => {
    fetchHighScores();
  }, []);

  const fetchHighScores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/highScores');
      setHighScores(response.data);
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  };

  const moveSnake = () => {
    if (isGameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;
    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood({ x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 20) });
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    if (checkCollision(newSnake)) {
      setIsGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  const changeDirection = (event) => {
    const { key } = event;
    switch (key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  const checkCollision = (newSnake) => {
    const head = newSnake[0];
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
        return true;
      }
    }
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 20) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username) return;

    try {
      await axios.post('http://localhost:5000/highScores/add', { username, score });
      setUsername('');
      fetchHighScores();
    } catch (error) {
      console.error('Error adding high score:', error);
    }
  };

  return (
    <div className="snake-game">
      <h1>Snake Game</h1>
      {isGameOver ? (
        <div>
          <div id='go'>Game Over</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Submit Score</button>
          </form>
        </div>
      ) : null}
      <div className="grid">
        {Array.from(Array(20).keys()).map((row) =>
          Array.from(Array(30).keys()).map((col) => {
            const isSnake = snake.some(segment => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <div key={`${row}-${col}`} className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}> </div>
            );
          })
        )}
      </div>

      <div className="high-scores">
        <h2>High Scores</h2>
        <ul>
          {highScores.map((score, index) => (
            <li key={index}>{score.username}: {score.score}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SnakeGame;
