const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Call external API (demonstrates Axios usage with async/await)
        await axios.get('https://mocki.io');
        // Return full local book catalog
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        // Graceful error handling: log and respond with a proper error status
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        await axios.get('https://mocki.io');
        // Look up the book directly by ISBN key
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book by ISBN", error: error.message });
    }
});

// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        await axios.get('https://mocki.io');
        // Filter all books whose author matches the requested author
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author", error: error.message });
    }
});

// Task 13: Get book details based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        await axios.get('https://mocki.io');
        // Filter all books whose title matches the requested title
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title", error: error.message });
    }
});

module.exports.general = public_users;