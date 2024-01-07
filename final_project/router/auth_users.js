const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 600 * 600 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in " + req.session.authorization );
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let newReview = req.query.newrev;
    let usern = req.session.authorization['username'];
    let keys1 = "";
    console.log(usern);
    console.log(newReview, isbn);
    let found = false;
    if(newReview.length == 0) {
        return res.status(408).json({message: "Please enter a valid review"});
    }
    for (var [key, value] of Object.entries(books)) {
        if(value.ISBN === isbn) {
            keys1 = key;
            value.reviews[usern] = newReview;
            books[key] = value;
        }
      }
      if (found) {
        return res.status(200).json({message: "review submitted succesfully now:" + books[key1]});
        } else {
          return res.status(408).json({message: "book with ISBN: " + isbn + "not found"});
        }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let usern = req.session.authorization['username'];
    let found = false;
    for (const [key, value] of Object.entries(books)) {
        if(value.ISBN === isbn) {
            if(value.reviews.haskey(usern)) {
              found = true;
              delete books.key.review[usern];
            } else {
            return res.status(408).json({message: "Please first write a review for this book"});
            
            }
        }
      }

  if (found) {
  return res.status(200).json({message: "review deleted succesfully"});
  } else {
    return res.status(408).json({message: "book with ISBN: " + isbn + "not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
