/*
============================================
; Title:  hemsouvanh-customer.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Date:   22 Feb 2024
; Description: Customer Mongoose model
;===========================================
*/

// Require Mongoose library
const mongoose = require('mongoose');

// Retrieve the Schema constructor from Mongoose
const Schema = mongoose.Schema;

// Define the lineItem schema
let lineItemSchema = new Schema({
  name: String, // Define a field named 'name' of type String
  price: Number, // Define a field named 'price' of type Number
  quantity: Number // Define a field named 'quantity' of type Number
});


// Define the invoice schema
let invoiceSchema = new Schema({
  subtotal: Number,
  tax: Number,
  dateCreated: String,
  dateShipped: String,
  lineItems: [lineItemSchema] // Array of lineItemSchema
});


// Define the customer schema
let customerSchema = new Schema({
  firstName: String,
  lastName: String,
  userName: String,
  invoices: [invoiceSchema]
});

// Define the model
let Customer = mongoose.model('Customer', customerSchema);

// Export the model
module.exports = Customer;
