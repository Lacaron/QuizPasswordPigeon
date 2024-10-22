const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('../data/leaderboard.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT,
                score INTEGER
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }
});


app.get('/api/breach/:hash', async (req, res) => {
    const hash = req.params.hash;
    const prefix = hash.slice(0, 5);

    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);

        res.set('Content-Type', 'text/plain');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the external API' });
    }
});

// Fetch the leaderboard
app.get('/api/board', (req, res) => {
    db.all('SELECT * FROM leaderboard ORDER BY score DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching leaderboard data' });
        } else {
            res.json(rows);
        }
    });
});

// Add a score to the leaderboard
app.post('/api/board/add', (req, res) => {
    const { user, score } = req.body;

    if (user && score !== undefined) {
        db.run('INSERT INTO leaderboard (user, score) VALUES (?, ?)', [user, score], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error adding score to leaderboard' });
            } else {
                res.status(200).json({ message: 'Score added successfully', id: this.lastID });
            }
        });
    } else {
        res.status(400).json({ message: 'Invalid request' });
    }
});

// Clear leaderboard (optional, for reset purposes)
app.post('/api/board/reset', (req, res) => {
    db.run('DELETE FROM leaderboard', (err) => {
        if (err) {
            res.status(500).json({ message: 'Error resetting leaderboard' });
        } else {
            res.status(200).json({ message: 'Leaderboard reset successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});