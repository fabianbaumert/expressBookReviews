const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = 'access';

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required for login." });
  }

  // // Check if the user exists with the provided username and password
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials. Please check your username and password." });
  }

  // // User is authenticated, create a JWT token for the session
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  // // Return the JWT token in the response
  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract ISBN and review from the request query
  const { isbn } = req.params;
  const { review } = req.query;

  // Check if ISBN and review are provided
  if (!isbn || !review) {
    return res.status(400).json({ error: "ISBN and review are required for adding/modifying a book review." });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Get the user's information from the JWT token
  const { username } = jwt.verify(token, JWT_SECRET);

  // Check if the book exists with the provided ISBN
  if (!books[isbn]) {
    return res.status(404).json({ error: "Book not found with the provided ISBN." });
  }

  // Update or add the review to the book's reviews object
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Book review added/modified successfully.", review });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.user.username;

  // Check if the book exists in the 'books' object
  if (!books[isbn]) {
    return res.status(404).json({ error: `Book with ISBN ${isbn} not found.` });
  }

  // Check if the user has a review for the given ISBN
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ error: `No review found for the authenticated user in Book with ISBN ${isbn}.` });
  }

  // Delete the user's review for the given ISBN
  delete books[isbn].reviews[username];

  // Send a success response
  res.status(200).json({ message: `Review deleted successfully for Book with ISBN ${isbn} and Username ${username}.` });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
