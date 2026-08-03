const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// =======================================================================
// TASK 10: Get all books
// =======================================================================
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/api/mock/books');
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx (e.g., Not Found)
            return res.status(error.response.status).json({ message: "Books not found" });
        } else if (error.request) {
            // Request was made but no response received (Network Issue)
            return res.status(503).json({ message: "Network issue: Service unavailable" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
});

// =======================================================================
// TASK 11: Get book details based on ISBN
// =======================================================================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/api/mock/books/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(404).json({ message: "Book not found" });
        } else if (error.request) {
            return res.status(503).json({ message: "Network issue: Service unavailable" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
});
  
// =======================================================================
// TASK 12: Get book details based on author
// =======================================================================
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/api/mock/books/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(404).json({ message: "Author not found" });
        } else if (error.request) {
            return res.status(503).json({ message: "Network issue: Service unavailable" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
});

// =======================================================================
// TASK 13: Get all books based on title
// =======================================================================
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/api/mock/books/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(404).json({ message: "Title not found" });
        } else if (error.request) {
            return res.status(503).json({ message: "Network issue: Service unavailable" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
});

// =======================================================================
// TASK 5: Get book review
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
// TASK 6: Register new user
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
// 💡 MOCK DATA ENDPOINTS FOR AXIOS TO CONSUME
// =======================================================================
public_users.get('/api/mock/books', (req, res) => res.status(200).json(books));

public_users.get('/api/mock/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    books[isbn] ? res.status(200).json(books[isbn]) : res.status(404).json({ message: "Not found" });
});

public_users.get('/api/mock/books/author/:name', (req, res) => {
    const name = req.params.name;
    const matching = Object.values(books).filter(b => b.author === name);
    matching.length > 0 ? res.status(200).json(matching) : res.status(404).json({ message: "Not found" });
});

public_users.get('/api/mock/books/title/:text', (req, res) => {
    const text = req.params.text;
    const matching = Object.values(books).filter(b => b.title === text);
    matching.length > 0 ? res.status(200).json(matching) : res.status(404).json({ message: "Not found" });
});

module.exports.general = public_users;