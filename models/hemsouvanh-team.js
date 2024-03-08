/*
============================================
; Title:  hemsouvanh-team.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso (https://github.com/buwebdev/web-420/blob/master/models/student.js)
; Date:   09 Mar 2024
; Description: Team Mongoose model
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Player schema
let playerSchema = new Schema({
  firstName: { type: String, required: true }, // Define a field named 'firstName' of type String
  lastName: { type: String, required: true },  // Define a field named 'lastName' of type String
  salary: { type: Number }                     // Define a field named 'salary' of type Number
});

// Define the Team schema that includes the playerSchema as an array
let teamSchema = new Schema({
  name: { type: String, required: true },       // Define a field named 'name' of type String for the team name
  mascot: { type: String, required: true },     // Define a field named 'mascot' of type String for the team mascot
  players: [playerSchema]                       // Define an array of playerSchema to hold players
});

// Define the Team model using the teamSchema
let Team = mongoose.model('Team', teamSchema);

// Export the Team model
module.exports = Team;
