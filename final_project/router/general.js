const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Base URL of this same server, used so Axios calls are meaningful (not external/unrelated)
const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using async/await with Axios
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        // Use Axios to fetch the full book list from this app's own '/' endpoint
        const response = await axios.get(`${BASE_URL}/`);
        const allBooks = response.data;
        const book = allBooks[isbn];

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
        // Use Axios to fetch the full book list from this app's own '/' endpoint
        const response = await axios.get(`${BASE_URL}/`);
        const allBooks = response.data;

        // Filter fetched books by matching author
        const filteredBooks = Object.values(allBooks).filter(b => b.author === author);

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
        // Use Axios to fetch the full book list from this app's own '/' endpoint
        const response = await axios.get(`${BASE_URL}/`);
        const allBooks = response.data;

        // Filter fetched books by matching title
        const filteredBooks = Object.values(allBooks).filter(b => b.title === title);

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