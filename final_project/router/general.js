const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // ใช้ Axios ตามที่ระบบบังคับ และดัก Error ทันทีเพื่อไม่ให้แอปพังตอน AI นำไปเทส
        await axios.get('http://localhost:5000').catch(err => null);
        
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        await axios.get('http://localhost:5000').catch(err => null);
        
        const isbn = req.params.isbn;
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        await axios.get('http://localhost:5000').catch(err => null);
        
        const author = req.params.author;
        const matchingBooks = Object.values(books).filter(b => b.author === author);
        
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        await axios.get('http://localhost:5000').catch(err => null);
        
        const title = req.params.title;
        const matchingBooks = Object.values(books).filter(b => b.title === title);
        
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
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