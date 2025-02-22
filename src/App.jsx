import React, { useState, useEffect, useRef } from 'react';
import styles from './styles/styles.module.css';

// Timer component: counts down and updates elapsed time for hints.
const Timer = ({ duration, onTimeUp, setElapsedTime, resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        setElapsedTime(duration - newTime);
        if (newTime <= 0) {
          clearInterval(timerId);
          onTimeUp();
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, duration, onTimeUp, setElapsedTime]);

  return <div className={styles.timer}>Time Left: {timeLeft} sec</div>;
};

// Canvas component: enables drawing when active.
const Canvas = ({ isActive }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // Initialize canvas with a white background
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleMouseDown = (e) => {
    if (!isActive) return;
    isDrawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e) => {
    if (!isActive || !isDrawing.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.beginPath();
    context.moveTo(lastPos.current.x, lastPos.current.y);
    context.lineTo(x, y);
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.stroke();
    lastPos.current = { x, y };
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    isDrawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={400}
      style={{ border: '2px solid #333', background: '#fff' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

// GuessInput component: allows the guesser to enter guesses.
const GuessInput = ({ onGuess, disabled }) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(guess);
    setGuess('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.guessForm}>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess..."
        disabled={disabled}
        className={styles.guessInput}
      />
      <button type="submit" disabled={disabled} className={styles.guessButton}>
        Guess
      </button>
    </form>
  );
};

// Returns a hint string by revealing one letter every 10 seconds.
const getHint = (word, elapsedTime) => {
  if (!word) return '';
  const lettersToReveal = Math.floor(elapsedTime / 10);
  return word
    .split('')
    .map((char, index) => (index < lettersToReveal ? char : '_'))
    .join(' ');
};

function App() {
  // Role: either 'drawer' or 'guesser'
  const [role, setRole] = useState(null);
  const [chosenWord, setChosenWord] = useState('');
  const [inputWord, setInputWord] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [drawerPoints, setDrawerPoints] = useState(0);
  const [guesserPoints, setGuesserPoints] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  
  const gameDuration = 60; // duration in seconds

  // Start the game round.
  const startGame = () => {
    if (role === 'drawer' && inputWord.trim() !== '') {
      setChosenWord(inputWord.trim().toLowerCase());
      setGameStarted(true);
      setGuessedCorrectly(false);
      setElapsedTime(0);
      setTimerResetKey(prev => prev + 1);
    } else if (role === 'guesser' && chosenWord !== '') {
      setGameStarted(true);
      setGuessedCorrectly(false);
      setElapsedTime(0);
      setTimerResetKey(prev => prev + 1);
    }
  };

  // Called when time is up.
  const handleTimeUp = () => {
    if (!guessedCorrectly) {
      alert("Time's up! The word was: " + chosenWord);
      resetGame();
    }
  };

  // Resets the game for a new round.
  const resetGame = () => {
    setGameStarted(false);
    setChosenWord('');
    setInputWord('');
    setElapsedTime(0);
    setGuessedCorrectly(false);
    // Optionally, clear the canvas.
  };

  // Checks the guess and awards points if correct.
  const handleGuess = (guess) => {
    if (guess.trim().toLowerCase() === chosenWord) {
      setGuessedCorrectly(true);
      alert("Correct Guess!");
      setDrawerPoints(prev => prev + 10);
      setGuesserPoints(prev => prev + 10);
    } else {
      alert("Incorrect Guess. Try again!");
    }
  };

  return (
    <div className={styles.app}>
      <h1>Drawing &amp; Guessing Game</h1>
      {/* Role selection */}
      {!role && (
        <div className={styles.roleSelection}>
          <button onClick={() => setRole('drawer')} className={styles.roleButton}>
            I'm the Drawer
          </button>
          <button onClick={() => setRole('guesser')} className={styles.roleButton}>
            I'm the Guesser
          </button>
        </div>
      )}

      {/* Drawer word input */}
      {role && !gameStarted && role === 'drawer' && (
        <div className={styles.wordSelection}>
          <h2>Enter a word for drawing:</h2>
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Enter word"
            className={styles.wordInput}
          />
          <button onClick={startGame} className={styles.startButton}>
            Start Game
          </button>
        </div>
      )}

      {/* Guesser waiting screen */}
      {role && !gameStarted && role === 'guesser' && (
        <div className={styles.waitingRoom}>
          <h2>Waiting for the drawer to choose a word...</h2>
          <p>(Make sure the drawer has set a word)</p>
          <button onClick={startGame} className={styles.startButton} disabled={!chosenWord}>
            Join Game
          </button>
        </div>
      )}

      {/* Main game area */}
      {gameStarted && (
        <div className={styles.gameContainer}>
          <div className={styles.scoreboard}>
            <div>Drawer Points: {drawerPoints}</div>
            <div>Guesser Points: {guesserPoints}</div>
          </div>
          <Timer
            duration={gameDuration}
            onTimeUp={handleTimeUp}
            setElapsedTime={setElapsedTime}
            resetKey={timerResetKey}
          />
          <div className={styles.wordHint}>
            {role === 'drawer'
              ? chosenWord.split('').join(' ')
              : getHint(chosenWord, elapsedTime)}
          </div>
          <div className={styles.gameArea}>
            {role === 'drawer' && <Canvas isActive={true} />}
            {role === 'guesser' && <Canvas isActive={false} />}
            <div className={styles.guessArea}>
              {role === 'guesser' && !guessedCorrectly && (
                <GuessInput onGuess={handleGuess} disabled={guessedCorrectly} />
              )}
            </div>
          </div>
          {guessedCorrectly && (
            <div>
              <h2>Round Over! Points awarded.</h2>
              <button onClick={resetGame} className={styles.restartButton}>
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <p>Simple React Drawing Game</p>
      </div>
    </div>
  );
}

export default App;
