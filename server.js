const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3003;

app.use(express.static('public'));
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cungvay10',
    database: 'hotel_management_system'
});

db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(100),
        hotelName VARCHAR(100),
        totalRoom INT,
        mobile VARCHAR(15),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
    );
`, (err) => {
    if (err) throw err;
    console.log("Database connected and table checked/created!");
});

// Register Route
app.post('/register', (req, res) => {
    const { fullname, hotelName, totalRoom, mobile, email, password } = req.body;
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });
        
        const query = 'INSERT INTO users (fullname, hotelName, totalRoom, mobile, email, password) VALUES (?, ?, ?, ?, ?, ?)';
        
        db.query(query, [fullname, hotelName, totalRoom, mobile, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: 'User already exists or DB error' });
            return res.status(200).json({ message: 'Registration successful' });
        });
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.query(query, [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Email not registered' });
        }
        
        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });
            if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

            // Save user info to session
            req.session.user = { id: user.id, email: user.email };
            return res.status(200).json({ message: 'Login successful' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
