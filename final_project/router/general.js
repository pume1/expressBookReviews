const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// --- FORCED UPDATE CACHE: v1.0.0 (ให้ระบบรู้ว่าเป็นไฟล์ใหม่) ---

// Task 1 & 10: Get all books using Promise callbacks
public_users.get('/', function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((bookList) => res.status(200).json(bookList))
        .catch((error) => res.status(500).json({ message: "Error fetching books" }));
});

// Task 2 & 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    let getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ message: error }));
});

// Task 3 & 12: Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    let getBooksByAuthor = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Author not found");
        }
    });

    getBooksByAuthor
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(404).json({ message: error }));
});

// Task 4 & 13: Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    let getBooksByTitle = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Title not found");
        }
    });

    getBooksByTitle
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(404).json({ message: error }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 6: Register new user
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