const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Assuming you have an array to store registered users
public_users.post("/register", (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required for registration." });
  }

  // Check if the user already exists with the same username
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists. Please choose a different username." });
  }

  // Create a new user object
  const newUser = {
    id: users.length + 1, // Assign a new ID to the user
    username,
    password,
  };

  // Save the new user to the array (in a real app, you'd save it to a database)
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully.", user: newUser });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
  let myPromise = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books))
  })

  //Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    return res.status(300).json(successMessage);
  })
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  let myPromise = new Promise((resolve,reject) => {
    resolve(books[req.params.isbn])
  })

  //Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    return res.status(300).json(successMessage);
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const filteredBooks = [];

  let myPromise = new Promise((resolve,reject) => {
    for (const id in books) {
    if (books.hasOwnProperty(id) && books[id].author === req.params.author) {
      filteredBooks.push(books[id]);
    }
  }
    resolve(filteredBooks)
  })

  //Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    return res.status(300).json(successMessage);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const filteredBooks = [];

  // for (const id in books) {
  //   if (books.hasOwnProperty(id) && books[id].title === req.params.title) {
  //     filteredBooks.push(books[id]);
  //   }
  // }
  // return res.status(300).json(filteredBooks);

 
  let myPromise = new Promise((resolve,reject) => {
    for (const id in books) {
    if (books.hasOwnProperty(id) && books[id].title === req.params.title) {
      filteredBooks.push(books[id]);
    }
    }
    resolve(filteredBooks)
  })

  //Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    return res.status(300).json(successMessage);
  })


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(300).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
