# PasswordPigeon
Welcome to the Password Game! This web application challenges users to create strong passwords while providing a fun and interactive experience.

## Features

- Interactive gameplay with multiple phases.
- Real-time password strength evaluation.
- Leaderboard to display high scores.
- Encourages users to create memorable yet secure passwords.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lacaron/QuizPasswordPigeon.git
   ```

2. Navigate to the project directory:
   ```bash
   cd QuizPasswordPigeon
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost`.

### Using Docker

1. Make sure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) installed.

2. Clone the repository:
   ```bash
   git clone https://github.com/Lacaron/QuizPasswordPigeon.git
   ```

3. Navigate to the project directory:
   ```bash
   cd QuizPasswordPigeon
   ```

4. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

5. Open your browser and go to `http://localhost`.


## Usage

- Click the **Start Game** button to begin.
- Follow the prompts to create a password.
- Submit your password to receive a score based on its strength.
- Your score will be displayed on the leaderboard if it is among the top scores.

## Game Phases

1. **Splash Page**: Displays the leaderboard and a start button.
2. **Password Reset Page**: Users input their password and confirm complexity.
3. **Password Strength Evaluation**: Users receive feedback on their password.
4. **Fake Login Page**: Users log in to receive a score based on their password.
5. **Score Page**: Displays the final score and sends it to the leaderboard.

## Score Calculation

The scoring system evaluates passwords based on various criteria, including:
- Length and complexity (uppercase, lowercase, numbers, special characters).
- Unique character count.
- User confirmation of password memorability.

## Leaderboard

Scores are stored and retrieved using a lightweight SQLite database. The leaderboard is updated with new scores after each game.

## Technologies Used

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure your code is well-documented and tested.
