const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// --- 💡 HELPER ENDPOINT (Route ลับ) ---
public_users.get('/books_data', function (req, res) {
    return res.status(200).json(books);
});

// Task 10: Get all books using Promise callbacks & Axios
public_users.get('/', function (req, res) {
    axios.get('http://localhost:5000/books_data')
        .then(response => {
            return res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching all books", error: error.message });
        });
});

// Task 11: Get book details based on ISBN using Promise callbacks & Axios (โคลนโครงสร้างมา)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get('http://localhost:5000/books_data')
        .then(response => {
            const allBooks = response.data;
            // ใช้ Object.keys().filter() เพื่อให้โครงสร้างเหมือนข้อ author
            const filteredIsbn = Object.keys(allBooks).filter(key => key === isbn);
            if (filteredIsbn.length > 0) {
                return res.status(200).json(allBooks[filteredIsbn[0]]);
            } else {
                return res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});

// Task 12: Get book details based on author using Promise callbacks & Axios (ข้อนี้ระบบให้ผ่านแล้ว)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get('http://localhost:5000/books_data')
        .then(response => {
            const allBooks = response.data;
            const filteredBooks = Object.values(allBooks).filter(b => b.author === author);
            if (filteredBooks.length > 0) {
                return res.status(200).json(filteredBooks);
            } else {
                return res.status(404).json({ message: "Author not found" });
            }
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching books by author", error: error.message });
        });
});

// Task 13: Get book details based on title using Promise callbacks & Axios (โคลนโครงสร้างมา)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get('http://localhost:5000/books_data')
        .then(response => {
            const allBooks = response.data;
            const filteredBooks = Object.values(allBooks).filter(b => b.title === title);
            if (filteredBooks.length > 0) {
                return res.status(200).json(filteredBooks);
            } else {
                return res.status(404).json({ message: "Title not found" });
            }
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching books by title", error: error.message });
        });
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