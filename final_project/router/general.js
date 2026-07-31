const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        let existingUser = users.filter((user) => user.username === username);
        
        if (existingUser.length > 0) {
            return res.status(404).json({message: "User already exists!"});
        } else {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
    }
    return res.status(404).json({message: "Unable to register user. Please provide username and password"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        // ใช้ Object.entries และ filter เพื่อลดความซ้ำซ้อนของโค้ด (Optimize ตามที่ AI สั่ง)
        const booksByAuthor = Object.entries(books)
            .filter(([isbn, book]) => book.author === author)
            .map(([isbn, book]) => ({ isbn, ...book }));
        
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksByTitle = Object.entries(books)
            .filter(([isbn, book]) => book.title === title)
            .map(([isbn, book]) => ({ isbn, ...book }));
            
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
