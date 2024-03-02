/*
============================================
; Title:  hemsouvanh-session-routes.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso URL: https://github.com/buwebdev/web-420/blob/master/routes/password-routes.js
; Date:   16 Feb 2024
; Description: Routes file for the users collection
;===========================================
*/

// Requirement statements
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/hemsouvanh-user');

// Salt rounds for bcrypt
const saltRounds = 10;

/**
 * signup
 * @openapi
 * /api/signup:
 *   post:
 *     tags:
 *       - Users
 *     name: signup
 *     summary: Registers a new user
 *     requestBody:
 *       description: User's signup information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *               - emailAddress
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               emailAddress:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: User successfully registered
 *       '401':
 *         description: Username is already in use
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/signup', async (req, res) => {
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res.status(401).send('Username is already in use');
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    // Create new user object including emailAddress as an array
const newUser = new User({
  userName: req.body.userName,
  password: hashedPassword,
  emailAddress: Array.isArray(req.body.emailAddress) ? req.body.emailAddress : [req.body.emailAddress]
});


    await newUser.save();
    res.status(200).send('User successfully registered');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Exception');
  }
});

/**
 * login
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Users
 *     name: login
 *     summary: Logs in a user
 *     requestBody:
 *       description: User's login information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *       '401':
 *         description: Invalid username and/or password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/login', async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ userName: req.body.userName });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).send('User successfully logged in');
    } else {
      res.status(401).send('Invalid username and/or password');
    }
  } catch (error) {
    console.error(error);
    res.status(501).send('MongoDB Exception');
  }
});

// Export the router
module.exports = router;
