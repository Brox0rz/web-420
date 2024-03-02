/*
============================================
; Title:  hemsouvanh-composer.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso (https://github.com/buwebdev/web-420/blob/master/models/student.js)
; Date:   04 Feb 2024
; Description: Composer Mongoose model
;===========================================
*/

// Require Mongoose library
const mongoose = require('mongoose');

// Retrieve the Schema constructor from Mongoose
const Schema = mongoose.Schema;

// Define the Composer schema
let composerSchema = new Schema({
  firstName: String, // Define a field named 'firstName' of type String
  lastName: String   // Define a field named 'lastName' of type String
});

// Define the model
let Composer = mongoose.model('Composer', composerSchema);

// Export the model
module.exports = Composer;
