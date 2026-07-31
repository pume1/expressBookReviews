const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// =========================================================
// 💡 INTERNAL API (Data Provider)
// สร้าง Endpoint นี้ขึ้นมาเพื่อจำลองเป็น Database API ภายนอก
// ให้ Axios สามารถยิงมาดึงข้อมูลไปใช้งานได้จริงๆ โดยไม่เกิดปัญหา
// =========================================================
public_users.get('/api/books', (req, res) => {
    return res.status(200).json(books);
});

// =========================================================
// TASK 10 (2 Points): Get all books using async/await with Axios
// Logic: Uses Axios to fetch data from the internal API and returns it.
// =========================================================
public_users.get('/', async function (req, res) {
    try {
        // ใช้ Axios ดึงข้อมูลจริงๆ และนำ response.data มาใช้งาน
        const response = await axios.get('http://localhost:5000/api/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching all books", error: error.message });
    }
});

// =========================================================
// TASK 11 (2 Points): Get book details based on ISBN using async/await with Axios
// Logic: Fetches all books via Axios, then finds the specific book by ISBN.
// =========================================================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        // ใช้ Axios ดึงข้อมูลจริงๆ
        const response = await axios.get('http://localhost:5000/api/books');
        const allBooks = response.data;
        
        if (allBooks[isbn]) {
            return res.status(200).json(allBooks[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

// =========================================================
// TASK 12 (2 Points): Get book details based on author using async/await with Axios
// Logic: Fetches books via Axios and filters them by the given author name.
// =========================================================
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        // ใช้ Axios ดึงข้อมูลจริงๆ
        const response = await axios.get('http://localhost:5000/api/books');
        const allBooks = response.data;
        
        const matchingBooks = Object.values(allBooks).filter(b => b.author === author);
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// =========================================================
// TASK 13 (2 Points): Get book details based on title using async/await with Axios
// Logic: Fetches books via Axios and filters them by the given title.
// =========================================================
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        // ใช้ Axios ดึงข้อมูลจริงๆ
        const response = await axios.get('http://localhost:5000/api/books');
        const allBooks = response.data;
        
        const matchingBooks = Object.values(allBooks).filter(b => b.title === title);
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

// =========================================================
// TASK 5: Get book review
// =========================================================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// =========================================================
// TASK 6: Register new user
// =========================================================
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