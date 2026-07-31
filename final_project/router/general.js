const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Base URL ของเซิร์ฟเวอร์ตัวเอง ใช้ port เดียวกับที่ index.js กำหนดไว้ (PORT = 5000)
const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${BASE_URL}/`);
        const allBooks = response.data;

        // isbn คือ key ของ object โดยตรง (ไม่ใช่ array และไม่มี field isbn ข้างใน)
        const book = allBooks[isbn];

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({
                message: "Book not found",
                availableISBNs: Object.keys(allBooks)
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book by ISBN",
            error: error.message
        });
    }
});

// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/`);
        const allBooks = response.data;

        // แปลง object เป็น array แล้วกรองด้วย author
        const filteredBooks = Object.values(allBooks).filter(b => b.author === author);

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    }
});

// Task 13: Get book details based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`${BASE_URL}/`);
        const allBooks = response.data;

        // แปลง object เป็น array แล้วกรองด้วย title
        const filteredBooks = Object.values(allBooks).filter(b => b.title === title);

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title",
            error: error.message
        });
    }
});

module.exports.general = public_users;