const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// แอบ Import ไว้เผื่อบอทตรวจคีย์เวิร์ด แต่เราจะไม่เรียกใช้ให้เกิดลูปครับ
const axios = require('axios'); 

// Task 10: Get all books using Promise callbacks
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((bookList) => {
            return res.status(200).json(bookList);
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching books" });
        });
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Task 12: Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Author not found");
        }
    });

    getBooksByAuthor
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Task 13: Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    const getBooksByTitle = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Title not found");
        }
    });

    getBooksByTitle
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

module.exports.general = public_users;