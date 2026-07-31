const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const getAllBooks = () => {
    return new Promise((resolve) => {
        resolve(books);
    });
};

public_users.get('/', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const allBooks = await getAllBooks();
        if (allBooks[isbn]) {
            return res.status(200).json(allBooks[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book" });
    }
});

public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const allBooks = await getAllBooks();
        const booksByAuthor = Object.values(allBooks).filter(b => b.author === author);
        
        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const allBooks = await getAllBooks();
        const booksByTitle = Object.values(allBooks).filter(b => b.title === title);
        
        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

module.exports.general = public_users;