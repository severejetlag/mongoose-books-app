// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////
var db = require('./models')
//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////
//  DATA
///////////////////


var newBookUUID = 18;







////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
   db.Book.find({})
    .populate('author')
    .exec(function(err, books){
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(books);
    });

});


// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
    db.Book.findById(req.params.id)
    // populate the author
    .populate('author')
    .exec(function(err, book){
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(book);
    });
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
    var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });
  // find the author from req.body
  db.Author.findOne({name: req.body.author}, function(err, author){
    if (err) {
      return console.log(err);
    }
    // add this author to the book
    newBook.author = author;
    // save newBook to database
    newBook.save(function(err, book){
      if (err) {
        return console.log("save error: " + err);
      }
      console.log("saved ", book.title);
      // send back the book!
      res.json(book);
    });
  });
});

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  console.log('books update', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  var updateBookIndex = books.findIndex(function(element, index) {
    return (element._id === parseInt(req.params.id)); //params are strings
  });
  console.log('updating book with index', deleteBookIndex);
  var bookToUpdate = books[deleteBookIndex];
  books.splice(updateBookIndex, 1, req.params);
  res.json(req.params);
});

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log(req.params)
  var bookId = req.params.id;

  db.Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook) {
    res.json(deletedBook);
  });
});


app.post('/api/books/:book_id/characters', function (req, res){
  var bookId = req.params.book_id;
  db.Book.findById(bookId)
    .populate('author')
    .exec(function(err, foundBook) {
      console.log(foundBook);
      if (err) {
        res.status(500).json({error: err.message});
      } else if (foundBook === null) {
        // Is this the same as checking if the foundBook is undefined?
        res.status(404).json({error: "No Book found by this ID"});
      } else {
        // push character into characters array
        foundBook.characters.push(req.body);
        // save the book with the new character
        foundBook.save();
        res.status(201).json(foundBook);
      }
    });
});



app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
