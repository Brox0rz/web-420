/*
============================================
; Title:  hemsouvanh-person-routes.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Date:   09 Feb 2024
; Description: Routes file for the people collection
;===========================================
*/


// Requirement statements
const express = require('express');
const router = express.Router();
const Person = require('../models/hemsouvanh-person');


// findAllPersons Operation
/**
 * @openapi
 * /api/persons:
 *   get:
 *     summary: Retrieves an array of all persons
 *     description: Query the people collection using the find() function on the Person model.
 *     responses:
 *       200:
 *         description: Array of person documents
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.get('/', async (req, res) => {
    try {
        const persons = await Person.find();
        res.status(200).json(persons);
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error) {
            res.status(501).send('MongoDB Exception');
        } else {
            res.status(500).send('Server Exception');
        }
    }
});

// createPerson Operation
/**
 * @openapi
 * /api/persons:
 *   post:
 *     summary: Creates a new person document
 *     description: Adds a new person to the people collection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roles:
 *                 type: array
 *               dependents:
 *                 type: array
 *               birthDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Person document created
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.post('/', async (req, res) => {
    try {
        const newPerson = new Person(req.body);
        const result = await newPerson.save();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error) {
            res.status(501).send('MongoDB Exception');
        } else {
            res.status(500).send('Server Exception');
        }
    }
});

// Export the router
module.exports = router;
