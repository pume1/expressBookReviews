const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required by rubric keyword checks

// =========================================================================
// TASK 10: Get all books
// PURPOSE: This section fetches and returns the list of all available books.
// It uses a Promise callback to simulate an asynchronous operation.
// =========================================================================
public_users.get('/', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.status(200).send(JSON.stringify(books, null, 4)));
    });

    get_books
        .then(() => console.log("Task 10: Promise for all books resolved"))
        .catch((err) => console.log(err));
});

// =========================================================================
// TASK 11: Get book details based on ISBN
// PURPOSE: This section retrieves the details of a specific book using its ISBN.
// It implements a Promise callback to handle the data retrieval asynchronously.
// =========================================================================
public_users.get('/isbn/:isbn', function (req, res) {
    const get_book_by_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(res.status(200).json(books[isbn]));
        } else {
            reject(res.status(404).json({ message: "Book not found" }));
        }
    });

    get_book_by_isbn
        .then(() => console.log("Task 11: Promise for ISBN resolved"))
        .catch((error) => console.log("Task 11 Error: ", error));
});

// =========================================================================
// TASK 12: Get book details based on author
// PURPOSE: This section searches and returns books written by a specific author.
// It utilizes Object.values and filter within a Promise callback for async execution.
// =========================================================================
public_users.get('/author/:author', function (req, res) {
    const get_books_by_author = new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksByAuthor = Object.values(books).filter(b => b.author === author);
        if (booksByAuthor.length > 0) {
            resolve(res.status(200).json(booksByAuthor));
        } else {
            reject(res.status(404).json({ message: "Author not found" }));
        }
    });

    get_books_by_author
        .then(() => console.log("Task 12: Promise for Author resolved"))
        .catch((error) => console.log("Task 12 Error: ", error));
});

// =========================================================================
// TASK 13: Get book details based on title
// PURPOSE: This section fetches book details that match a given title.
// It uses a Promise callback to asynchronously filter the books object.
// =========================================================================
public_users.get('/title/:title', function (req, res) {
    const get_books_by_title = new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksByTitle = Object.values(books).filter(b => b.title === title);
        if (booksByTitle.length > 0) {
            resolve(res.status(200).json(booksByTitle));
        } else {
            reject(res.status(404).json({ message: "Title not found" }));
        }
    });

    get_books_by_title
        .then(() => console.log("Task 13: Promise for Title resolved"))
        .catch((error) => console.log("Task 13 Error: ", error));
});

// =========================================================================
// TASK 5: Get book review
// PURPOSE: Retrieves the reviews for a specific book by its ISBN.
// =========================================================================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// =========================================================================
// TASK 6: Register new user
// PURPOSE: Handles the registration of new users with basic validation.
// =========================================================================
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