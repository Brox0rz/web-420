/*
============================================
; Title:  hemsouvanh-person.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Date:   09 Feb 2024
; Description: Person Mongoose model
;===========================================
*/

// Require Mongoose library
const mongoose = require('mongoose');

// Retrieve the Schema constructor from Mongoose
const Schema = mongoose.Schema;

// Define the Role schema
let roleSchema = new Schema({
  text: String, // Define a field named 'text' of type String
});

// Define the Dependent schema
let dependentSchema = new Schema({
  firstName: String, // Define a field named 'firstName' of type String
  lastName: String, // Define a field named 'lastName' of type String
});

// Define the Person schema
let personSchema = new Schema({
  firstName: String, // Define a field named 'firstName' of type String
  lastName: String, // Define a field named 'lastName' of type String
  roles: [roleSchema], // Define a field named 'roles' of type Array
  dependents: [dependentSchema], // An array of Dependent documents
  birthDate: String, // Define a field named 'birthDate' of type String
});

// Define the model
let Person = mongoose.model('Person', personSchema);

// Export the model
module.exports = Person;
