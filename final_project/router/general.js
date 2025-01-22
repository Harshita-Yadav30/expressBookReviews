const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  console.log("Received Data:", req.body);
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"User Created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Check username and password"})
  }  

 
});

// Get the book list available in the shop using async await
public_users.get('/', (req, res) => {
    const getBooks = () => {
        return new Promise((resolve,reject) => {
          setTimeout(() => {
            resolve(books);
          },1000);
        })
    }
    getBooks().then((books) => {
        res.json(books);
    }).catch((err) =>{
      res.status(500).json({error: "An error occured"});
    });  
});
  
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) =>{
    
    const ISBN = req.params.isbn;
    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const book = books[ISBN];
            if(book){
              resolve(book);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
            
    }
    booksBasedOnIsbn(ISBN).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });
      
    //await res.send(books[ISBN]);    
   
   });
    
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {

  //using promises
  const author = req.params.author;
  const booksBasedOnAuthor = (auth) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            let filteredbooks = [];

            for (let i in books){
              if(books[i]["author"] == auth){
                // console.log(books[i]["author"]);
                filteredbooks.push(books[i]);
              }
            }

            if(filteredbooks.length>0){
              // console.log(filteredbooks);
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnAuthor(author).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });  
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  const title = req.params.title;
  const booksBasedOnTitle = (booktitle) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            let filteredbooks = [];

            for (let i in books){
              if(books[i]["title"] == booktitle){
                filteredbooks.push(books[i]);
              }
            }

            if(filteredbooks.length>0){
              // console.log(filteredbooks);
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnTitle(title).then((new_books) =>{
      res.json(new_books);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });

  
  
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  
  const isbn = req.params.isbn;
  console.log(books[isbn]["reviews"]);
  await res.send(JSON.stringify(books[isbn]));
  
});

module.exports.general = public_users;