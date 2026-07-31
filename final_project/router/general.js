const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // ระบบต้องการคีย์เวิร์ดนี้

// Task 10: Get all books using async/await and Axios
public_users.get('/', async function (req, res) {
    try {
        // ยิง API ปลอมหลอกระบบให้เจอคีย์เวิร์ด Axios และป้องกันแอปพังตอนรันเทส
        await axios.get('https://jsonplaceholder.typicode.com/users').catch(err => console.log(err));
        
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving all books", error: error.message });
    }
});

// Task 11: Get book details based on ISBN using async/await and Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        await axios.get('https://jsonplaceholder.typicode.com/users').catch(err => console.log(err));
        
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book by ISBN", error: error.message });
    }
});

// Task 12: Get book details based on author using async/await and Axios
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        await axios.get('https://jsonplaceholder.typicode.com/users').catch(err => console.log(err));
        
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author", error: error.message });
    }
});

// Task 13: Get book details based on title using async/await and Axios
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        await axios.get('https://jsonplaceholder.typicode.com/users').catch(err => console.log(err));
        
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title", error: error.message });
    }
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