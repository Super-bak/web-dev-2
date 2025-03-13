const express = require('express');
const client= require('./db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());

const JWT_SECRET = 'test'; 
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const generateToken = (user) => {
    return jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
    });
};
app.post('/register', async (req, res) => {
    const { email, password,  } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("A registration is made email: " + email);

    try {
        await client.query(
            `INSERT INTO users (username, password) VALUES ($1, $2)`, 
            [email, hashedPassword]
        );
        res.status(201).send('User registered');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
    
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("A Login is made email: " + email);


    try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = generateToken(user);
            res.json({ token });
        } else {
            res.status(400).send('Invalid password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Get User by ID (Protected Endpoint)
app.get('/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user');
    }
 
});

// Get Posts (Query Parameters)
app.get('/posts', async (req, res) => {

    try {
        const result = await client.query('SELECT * FROM posts ');
        const user = result.rows;

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Error retrieving postss');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving post');
    }
});

app.post('/posts', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const { username } = req.user;
    console.log("username",username);   
    try {
        const result = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user) {
            await client.query(
                'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)',
                [title, content, user.id]
            );
            res.status(201).send('Post created');
        } else {
            res.status(404).send('Post not created');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});