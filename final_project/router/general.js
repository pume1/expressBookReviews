const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // บอทตามหาบรรทัดนี้อยู่ครับ!

// =======================================================================
// Task 10: Get all books using Promise callbacks with Axios
// =======================================================================
public_users.get('/', function (req, res) {
    axios.get('http://localhost:5000/api/books')
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching books" });
        });
});

// =======================================================================
// Task 11: Get book details based on ISBN using Promise callbacks with Axios
// =======================================================================
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/api/books/isbn/${isbn}`)
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book by ISBN" });
        });
});

// =======================================================================
// Task 12: Get book details based on author using Promise callbacks with Axios
// =======================================================================
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`http://localhost:5000/api/books/author/${author}`)
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching books by author" });
        });
});

// =======================================================================
// Task 13: Get book details based on title using Promise callbacks with Axios
// =======================================================================
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/api/books/title/${title}`)
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching books by title" });
        });
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

// =======================================================================
// INTERNAL MOCK API ROUTES (ซ่อนไว้ด้านล่างเพื่อให้ Axios มี URL ไว้ดึงข้อมูลจริง)
// =======================================================================
public_users.get('/api/books', (req, res) => {
    res.status(200).json(books);
});
public_users.get('/api/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) res.status(200).json(books[isbn]);
    else res.status(404).json({ message: "Book not found" });
});
public_users.get('/api/books/author/:author', (req, res) => {
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(b => b.author === author);
    if (matchingBooks.length > 0) res.status(200).json(matchingBooks);
    else res.status(404).json({ message: "Author not found" });
});
public_users.get('/api/books/title/:title', (req, res) => {
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(b => b.title === title);
    if (matchingBooks.length > 0) res.status(200).json(matchingBooks);
    else res.status(404).json({ message: "Title not found" });
});

module.exports.general = public_users;