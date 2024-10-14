require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Book = require('./models/Book');

// Initialize the app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection string from .env
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

// POST route to add a new book
app.post('/add-book', async (req, res) => {
  const { name, author, genre, year, description } = req.body;

  const newBook = new Book({
    name,
    author,
    genre,
    year,
    description,
  });

  try {
    await newBook.save();
    res.status(200).send('Book added successfully!');
  } catch (err) {
    res.status(500).send('Error adding book:', err);
  }
});

// GET route to fetch all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();  // Retrieve all books from the database
    res.json(books);  // Send the books as a JSON response
  } catch (err) {
    res.status(500).send('Error fetching books:', err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
