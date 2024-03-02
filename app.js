/*
============================================
; Title:  app.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Updated:   04 Feb 2024
; Description: server file for the composer app
;===========================================
*/

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');

const app = express();

const username = encodeURIComponent('web420_user');
const password = encodeURIComponent('s3cret');
const database = 'web420DB';

// MongoDB connection string
const mongoDBConnectionString = `mongodb+srv://${username}:${password}@bellevueuniversity.0wy1rgj.mongodb.net/${database}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(mongoDBConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin'
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB:', err));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WEB 420 RESTful APIs',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Files containing annotations for the OpenAPI Specification
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
const composerRoutes = require('./routes/hemsouvanh-composer-routes');
app.use('/api/composers', composerRoutes);

const personRoutes = require('./routes/hemsouvanh-person-routes');
app.use('/api/persons', personRoutes);

const userRoutes = require('./routes/hemsouvanh-session-routes');
app.use('/api/users', userRoutes);

const customerRoutes = require('./routes/hemsouvanh-node-shopper-routes');
app.use('/api/customers', customerRoutes);


// Server listening
app.listen(port, () => {
  console.log(`Application started and listening on port ${port}`);
});