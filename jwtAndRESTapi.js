const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const SECRET_KEY = "your_secret_key"; // Change this to a secure key in production

// Mock database
let users = []; // Stores users in memory for simplicity (username, hashed password)
let books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// Helper function to authenticate JWT tokens
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send("Access Denied: No Token Provided");

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = user; // Attach the user payload to request object
        next();
    });
}

// Register endpoint (sign up a new user)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send("User registered successfully");
});

// Login endpoint (authenticate user and issue a token)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).send("Invalid username or password");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid username or password");

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Protect all /books routes with JWT authentication
app.use('/books', authenticateToken);

// GET all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET a specific book
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send("Book not found");
    res.json(book);
});

// POST a new book
app.post('/books', (req, res) => {
    const newBook = { id: books.length + 1, title: req.body.title, author: req.body.author };
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT update an existing book
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send("Book not found");
    book.title = req.body.title;
    book.author = req.body.author;
    res.json(book);
});

// DELETE a book
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).send("Book not found");
    books.splice(bookIndex, 1);
    res.send("Book deleted successfully");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
