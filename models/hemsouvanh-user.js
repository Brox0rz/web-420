/*
============================================
; Title:  hemsouvanh-user.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Date:   16 Feb 2024
; Description: User Mongoose model
;===========================================
*/

// Require Mongoose library
const mongoose = require('mongoose');

// Retrieve the Schema constructor from Mongoose
const Schema = mongoose.Schema;

// Define the User schema
let userSchema = new Schema({
  userName: String, // Define a field named 'userName' of type String
  password: String, // Define a field named 'password' of type String
  emailAddress: [{ type: String, required: true }] // Define a field named 'emailAddress' of type Array
});

// Define the model
let User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
