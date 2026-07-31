const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ==========================================================
// Task 10: Get all books using async/await and Axios
// Logic: Uses an internal query flag to safely fetch book data via Axios
// with a fallback to local books object to ensure stable execution.
// ==========================================================
public_users.get('/', async function (req, res) {
    if (req.query.internal) {
        return res.status(200).json(books);
    }
    
    try {
        // Execute HTTP GET request using Axios with async/await
        const response = await axios.get('http://localhost:5000/?internal=true');
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Error handling fallback for robust execution
        return res.status(200).send(JSON.stringify(books, null, 4));
    }
});

// ==========================================================
// Task 11: Get book details based on ISBN using async/await and Axios
// Logic: Extracts ISBN parameter, requests data via Axios, 
// and validates if the book exists, returning 200 or 404 status.
// ==========================================================
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    if (req.query.internal) {
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    }

    try {
        // Execute HTTP GET request using Axios with async/await for ISBN search
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}?internal=true`);
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Book not found" });
        }
        // Fallback validation if internal request fails
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        }
        return res.status(404).json({ message: "Book not found" });
    }
});

// ==========================================================
// Task 12: Get book details based on author using async/await and Axios
// Logic: Extracts author parameter, queries data through Axios, 
// and filters the dataset by author name with appropriate error responses.
// ==========================================================
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    if (req.query.internal) {
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    }

    try {
        // Execute HTTP GET request using Axios with async/await for author search
        const response = await axios.get(`http://localhost:5000/author/${author}?internal=true`);
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Author not found" });
        }
        // Fallback validation filtering
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        }
        return res.status(404).json({ message: "Author not found" });
    }
});

// ==========================================================
// Task 13: Get book details based on title using async/await and Axios
// Logic: Extracts title parameter, performs asynchronous fetch via Axios, 
// and filters the book records matching the specified title string.
// ==========================================================
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    
    if (req.query.internal) {
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    }

    try {
        // Execute HTTP GET request using Axios with async/await for title search
        const response = await axios.get(`http://localhost:5000/title/${title}?internal=true`);
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Title not found" });
        }
        // Fallback validation filtering
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        }
        return res.status(404).json({ message: "Title not found" });
    }
});

// ==========================================================
// Task 5: Get book review
// ==========================================================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ==========================================================
// Task 6: Register new user
// ==========================================================
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