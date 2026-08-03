const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// =======================================================================
// Task 10: Get all books using async/await and Axios
// =======================================================================
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching all books:', error.message);
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// =======================================================================
// Task 11: Get book details based on ISBN using async/await and Axios
// =======================================================================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/api/books/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching book by ISBN ${req.params.isbn}:`, error.message);
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// =======================================================================
// Task 12: Get book details based on author using async/await and Axios
// =======================================================================
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/api/books/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching books by author ${req.params.author}:`, error.message);
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// =======================================================================
// Task 13: Get book details based on title using async/await and Axios
// =======================================================================
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/api/books/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching books by title ${req.params.title}:`, error.message);
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// =======================================================================
// Task 5: Get book review
// =======================================================================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// =======================================================================
// Task 6: Register new user
// =======================================================================
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });    
        }
    } 
    return res.status(404).json({ message: "Unable to register user." });
});

// =======================================================================
// =======================================================================
public_users.get('/api/books', (req, res) => {
    res.status(200).json(books);
});
public_users.get('/api/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) res.status(200).json(books[isbn]);
    else res.status(404).json({ message: "Book not found" });
});
public_users.get('/api/books/author/:author', (req, res) => {
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(b => b.author === author);
    if (matchingBooks.length > 0) res.status(200).json(matchingBooks);
    else res.status(404).json({ message: "Author not found" });
});
public_users.get('/api/books/title/:title', (req, res) => {
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(b => b.title === title);
    if (matchingBooks.length > 0) res.status(200).json(matchingBooks);
    else res.status(404).json({ message: "Title not found" });
});

module.exports.general = public_users;