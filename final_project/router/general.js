const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Internal API routes to serve data for Axios requests
public_users.get('/api/books', (req, res) => res.status(200).json(books));
public_users.get('/api/books/isbn/:isbn', (req, res) => {
    if (books[req.params.isbn]) res.status(200).json(books[req.params.isbn]);
    else res.status(404).json({ message: "Book not found" });
});
public_users.get('/api/books/author/:author', (req, res) => {
    const matchingBooks = Object.values(books).filter(b => b.author === req.params.author);
    if (matchingBooks.length > 0) res.status(200).json(matchingBooks);
    else res.status(404).json({ message: "Author not found" });
});
public_users.get('/api/books/title/:title', (req, res) => {
    const matchingBooks = Object.values(books).filter(b => b.title === req.params.title);
    if (matchingBooks.length > 0) res.status(200).json(matchingBooks);
    else res.status(404).json({ message: "Title not found" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    axios.get('http://localhost:5000/api/books')
        .then((response) => {
            // Returns the full list of books in JSON format
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book list" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/api/books/isbn/${isbn}`)
        .then((response) => {
            // Returns the specific book matching the requested ISBN
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(404).json({ message: "Book not found" });
        });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`http://localhost:5000/api/books/author/${author}`)
        .then((response) => {
            // Filters and returns all books written by the specified author
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(404).json({ message: "Author not found" });
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/api/books/title/${title}`)
        .then((response) => {
            // Filters and returns all books that match the specified title
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(404).json({ message: "Title not found" });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Register new user
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

module.exports.general = public_users;