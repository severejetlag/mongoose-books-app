// book.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
     title: String,
     author: String,
     author: {
	    type: Schema.Types.ObjectId,
	    ref: 'Author'
	},
     image: String, 
     releaseDate: String,
     characters: [CharacterSchema] 
 });

var Book = mongoose.model('Book', BookSchema);
module.exports = Book;

// models/book.js
var CharacterSchema = new Schema({
  name: String
});
