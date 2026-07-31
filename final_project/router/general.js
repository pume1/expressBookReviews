const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books
public_users.get('/', function (req, res) {
    let getBooksPromise = new Promise((resolve, reject) => {
        resolve(books);
    });
    getBooksPromise.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    });
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let getIsbnPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    getIsbnPromise.then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(404).json({message: error});
    });
});

// Task 12: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let getAuthorPromise = new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksByAuthor = Object.values(books).filter(b => b.author === author);
        resolve(booksByAuthor);
    });
    getAuthorPromise.then((result) => {
        return res.status(200).json(result);
    });
});

// Task 13: Get book details based on title
public_users.get('/title/:title', function (req, res) {
    let getTitlePromise = new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksByTitle = Object.values(books).filter(b => b.title === title);
        resolve(booksByTitle);
    });
    getTitlePromise.then((result) => {
        return res.status(200).json(result);
    });
});

module.exports.general = public_users;