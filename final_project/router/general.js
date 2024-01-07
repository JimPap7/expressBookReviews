const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Promise-Based Function of get all books
let GetAllBooksPromise = new Promise((resolve,reject) => {
resolve(JSON.stringify(books,null,4));
});


GetAllBooksPromise.then((successMessage) => {
    console.log("From Callback 1" + successMessage)
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).send(JSON.stringify(books,null,4));
});

//Get books by isbn promise based
let GetBooksISBN = (isbn) => new Promise((resolve,reject) => {
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.ISBN === isbn) {
            book = value;
        }
      }
    resolve(JSON.stringify(book,null,4)); 
});
    
GetBooksISBN("123456").then((successMessage) => {
    console.log("From Callback2 " + successMessage)
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.ISBN === isbn) {
            book = value;
        }
      }
    res.send(JSON.stringify(book,null,4)); 
});

  // Get book based on author promise based
let GetBooksAuthor = (author) => new Promise((resolve,reject) => {
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.author === author) {
            book = value;
        }
      }
    resolve(JSON.stringify(book,null,4)); 
});
    
GetBooksAuthor("Chinua Achebe").then((successMessage) => {
    console.log("From Callback 3" + successMessage)
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.author === author) {
            book = value;
        }
      }
    res.send(JSON.stringify(book,null,4)); 
});

//get book based on title promise based
let GetBooksTitle = (title) => new Promise((resolve,reject) => {
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.title === title) {
       
            book = value;
        }
      }
    resolve(JSON.stringify(book,null,4)); 
});
    
GetBooksTitle("One Thousand and One Nights").then((successMessage) => {
    console.log("From Callback4 " + successMessage)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.title === title) {
            book = value;
        }
      }
    res.send(JSON.stringify(book,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = {};
    for (const [key, value] of Object.entries(books)) {
        if(value.ISBN === isbn) {
            book = value;
        }
      }
    let reviews = book.reviews;
    res.send(JSON.stringify(reviews,null,4));
});

module.exports.general = public_users;
