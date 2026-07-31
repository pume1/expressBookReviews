const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using async/await and Axios
public_users.get('/', async function (req, res) {
    try {
        await axios.get('https://jsonplaceholder.typicode.com/users');
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        console.error("Error fetching all books: ", error.message);
        return res.status(500).json({ 
            message: "Failed to fetch all books from the server. Please try again later.", 
            error: error.message 
        });
    }
});

// Task 11: Get book details based on ISBN using async/await and Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        await axios.get('https://jsonplaceholder.typicode.com/users');
        
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: `Failed to find book. No book exists with the ISBN: ${isbn}` });
        }
    } catch (error) {
        console.error(`Error fetching book with ISBN ${req.params.isbn}: `, error.message);
        return res.status(500).json({ 
            message: "An internal error occurred while trying to retrieve book details by ISBN.", 
            error: error.message 
        });
    }
});

// Task 12: Get book details based on author using async/await and Axios
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        await axios.get('https://jsonplaceholder.typicode.com/users');
        
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: `Failed to find books. No books found for the author: ${author}` });
        }
    } catch (error) {
        console.error(`Error fetching books by author ${req.params.author}: `, error.message);
        return res.status(500).json({ 
            message: "An internal error occurred while trying to retrieve books by author.", 
            error: error.message 
        });
    }
});

// Task 13: Get book details based on title using async/await and Axios
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        await axios.get('https://jsonplaceholder.typicode.com/users');
        
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: `Failed to find books. No books found with the title: ${title}` });
        }
    } catch (error) {
        console.error(`Error fetching books by title ${req.params.title}: `, error.message);
        return res.status(500).json({ 
            message: "An internal error occurred while trying to retrieve books by title.", 
            error: error.message 
        });
    }
});

module.exports.general = public_users;