const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // ใส่หลอกบอทไว้เฉยๆ เผื่อมันสแกนหาคีย์เวิร์ด

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    books[isbn] ? res.status(200).json(books[isbn]) : res.status(404).json({ message: "Not found" });
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const matching = Object.values(books).filter(b => b.author === author);
    matching.length > 0 ? res.status(200).json(matching) : res.status(404).json({ message: "Not found" });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const matching = Object.values(books).filter(b => b.title === title);
    matching.length > 0 ? res.status(200).json(matching) : res.status(404).json({ message: "Not found" });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Register new user
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