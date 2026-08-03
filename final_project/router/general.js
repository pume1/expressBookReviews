const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// =======================================================================
// Task 10: Get all books using Promise callbacks
// =======================================================================
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ message: "Error fetching books" }));
});

// =======================================================================
// Task 11: Get book details based on ISBN using Promise callbacks
// =======================================================================
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// =======================================================================
// Task 12: Get book details based on author using Promise callbacks
// =======================================================================
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(b => b.author === author);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "Author not found" });
        }
    })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// =======================================================================
// Task 13: Get book details based on title using Promise callbacks
// =======================================================================
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(b => b.title === title);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "Title not found" });
        }
    })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// =======================================================================
// Task 5: Get book review
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
// Task 6: Register new user
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

module.exports.general = public_users;