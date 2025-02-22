# Drawing & Guessing Game

A simple React-based game where one person draws a word and the other guesses it. The Drawer selects a word and draws on the canvas, while the Guesser attempts to guess the word using visual clues and hints provided as time elapses. Both players earn points when the Guesser correctly identifies the word!

## Features

- **Two-Player Modes:** Choose between being the Drawer or the Guesser.
- **Drawing Canvas:** A dedicated canvas for the Drawer to illustrate the chosen word.
- **Real-Time Guessing:** The Guesser inputs guesses via an interactive input field.
- **Dynamic Hint System:** Gradual hints are revealed (one letter every 10 seconds) to aid the Guesser.
- **Points System:** Earn points for correct guesses.
- **Responsive UI:** Built with React and styled using CSS Modules for a modern look.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v12 or higher recommended)
- npm (comes with Node.js) or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/drawing-game.git
   cd drawing-game
Install the dependencies:

Using npm:
npm install
Or using yarn:

yarn install
Running the Project
Start the development server:

npm start
The application should now be running on http://localhost:3000.

How to Play
Select Role:
When the app loads, choose whether you want to be the Drawer or the Guesser.

Drawer:

Enter a word in the input field.
Click the "Start Game" button to begin drawing on the canvas.
Guesser:

Wait on the waiting screen until the Drawer has chosen a word.
Watch the drawing as it progresses.
Use the hints (letters revealed as time passes) to help you guess the word.
Type your guess in the input field and submit it.
Earn points if you guess correctly!
Game Mechanics:

The game is timed. As time counts down, hints are gradually provided.
Both the Drawer and the Guesser are awarded points for a correct guess.
If time runs out before the word is guessed, the correct word is revealed and the round ends.
Project Structure

drawing-game/
├── src/
│   ├── App.jsx              # Main React component with game logic
│   ├── index.js             # Application entry point
│   └── styles/
│       └── styles.module.css  # CSS Module for component styling
└── package.json
Future Improvements
Multiplayer Support: Integrate real-time communication (e.g., using Socket.IO) for a true multiplayer experience across devices.
Enhanced Drawing Tools: Expand the drawing interface with additional tools and color options.
Improved UI/UX: Refine the design and animations for a smoother experience.
Persistent Scores: Add leaderboards and persistent score tracking across sessions.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your improvements or bug fixes.

License
This project is licensed under the MIT License.

Acknowledgements
This project is inspired by popular drawing and guessing games.
Built as a demonstration of React, CSS Modules, and simple game logic.
