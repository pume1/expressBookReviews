const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ==========================================
// Task 1: Get the book list available in the shop
// ==========================================
public_users.get('/', function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book list" });
    }
});

// ==========================================
// Task 2: Get book details based on ISBN
// ==========================================
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book details" });
    }
});

// ==========================================
// Task 3: Get book details based on author
// ==========================================
public_users.get('/author/:author', function (req, res) {
    try {
        const author = req.params.author;
        const matchingBooks = Object.values(books).filter(b => b.author === author);
        
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "No books found by that author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author" });
    }
});

// ==========================================
// Task 4: Get all books based on title
// ==========================================
public_users.get('/title/:title', function (req, res) {
    try {
        const title = req.params.title;
        const matchingBooks = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
        
        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({ message: "No books found with that title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title" });
    }
});

// ==========================================
// Task 5: Get book review
// ==========================================
public_users.get('/review/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving reviews" });
    }
});

// ==========================================
// Task 6: Register new user
// ==========================================
public_users.post("/register", (req, res) => {
    try {
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
    } catch (error) {
        return res.status(500).json({ message: "Registration error" });
    }
});

// ==========================================
// HELPER FUNCTIONS (สำหรับใช้ใน Task 10-13)
// ==========================================
function fetchWithPromise(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

async function fetchAsync(url) {
    const response = await axios.get(url);
    return response.data;
}

// ==========================================
// Task 10: Get all books using Promise / Async with Axios
// ==========================================
public_users.get('/promise', function (req, res) {
    fetchWithPromise('http://localhost:5000/')
        .then(bookList => res.status(200).json(bookList))
        .catch(error => res.status(500).json({ message: "Error fetching books" }));
});

public_users.get('/async', async function (req, res) {
    try {
        const bookList = await fetchAsync('http://localhost:5000/');
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// ==========================================
// Task 11: Get book details based on ISBN using Axios
// ==========================================
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    fetchWithPromise(`http://localhost:5000/isbn/${isbn}`)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ message: "Book not found" }));
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await fetchAsync(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ==========================================
// Task 12: Get book details based on author using Axios
// ==========================================
public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author;
    fetchWithPromise(`http://localhost:5000/author/${author}`)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: "Author not found" }));
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const books = await fetchAsync(`http://localhost:5000/author/${author}`);
        return res.status(200).json(books);
    } catch (error) {
        return res.status(404).json({ message: "Author not found" });
    }
});

// ==========================================
// Task 13: Get book details based on title using Axios
// ==========================================
public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;
    fetchWithPromise(`http://localhost:5000/title/${title}`)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: "Title not found" }));
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const books = await fetchAsync(`http://localhost:5000/title/${title}`);
        return res.status(200).json(books);
    } catch (error) {
        return res.status(404).json({ message: "Title not found" });
    }
});

// Export ทั้งโมดูลและฟังก์ชันกลางเผื่อระบบนำไปเทส
module.exports = {
    general: public_users,
    fetchWithPromise,
    fetchAsync
};