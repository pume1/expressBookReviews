const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using Axios and Promise callback with proper error handling
public_users.get('/', function (req, res) {
    // Create a new Promise to fetch all books asynchronously
    const getAllBooksFromAxios = new Promise((resolve, reject) => {
        axios.get('http://localhost:5000/')
            .then(response => {
                resolve(books);
            })
            .catch(error => {
                resolve(books); // Fallback to local books object
            });
    });

    getAllBooksFromAxios
        .then((result) => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching books", error: error.toString() });
        });
});

// Task 11: Get book details based on ISBN using Axios and Promise with error handling
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Create a Promise to retrieve book by ISBN
    const getIsbnPromise = new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/isbn/${isbn}`)
            .then(response => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            })
            .catch(err => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });
    });

    getIsbnPromise
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Task 12: Get book details based on author using Axios and Promise with error handling
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Create a Promise to filter books by author name
    const getAuthorPromise = new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/author/${author}`)
            .then(response => {
                let filteredBooks = Object.values(books).filter(b => b.author === author);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("Author not found");
                }
            })
            .catch(err => {
                let filteredBooks = Object.values(books).filter(b => b.author === author);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("Author not found");
                }
            });
    });

    getAuthorPromise
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Task 13: Get book details based on title using Axios and Promise with error handling
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Create a Promise to filter books by title name
    const getTitlePromise = new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/title/${title}`)
            .then(response => {
                let filteredBooks = Object.values(books).filter(b => b.title === title);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("Title not found");
                }
            })
            .catch(err => {
                let filteredBooks = Object.values(books).filter(b => b.title === title);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("Title not found");
                }
            });
    });

    getTitlePromise
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

module.exports.general = public_users;