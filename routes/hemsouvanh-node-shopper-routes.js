/*
============================================
; Title:  hemsouvanh-node-shopper-routes.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Date:   25 Feb 2024
; Description: Routes file for the customers collection
;===========================================
*/

// Requirement statements
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/hemsouvanh-user');
const Customer = require('../models/hemsouvanh-customer');

// Create a new customer
/**
 * @openapi
 * /api/customers:
 *   post:
 *     summary: Create a new customer
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
 *               userName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer added to MongoDB
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.post('/customers', async (req, res) => {
  try {
    const newCustomer = new Customer({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      invoices: []
    });
    
    await newCustomer.save();
    res.status(200).json({ message: 'Customer added to MongoDB' });
  } catch (error) {
    console.error(error);
    res.status(error.name === 'MongoError' ? 501 : 500).send('Server Exception');
  }
});

// Create a new invoice by username
/**
 * @openapi
 * /api/customers/{username}/invoices:
 *   post:
 *     summary: Create a new invoice for a customer by username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the customer
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subtotal:
 *                 type: number
 *               tax:
 *                 type: number
 *               dateCreated:
 *                 type: string
 *               dateShipped:
 *                 type: string
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Invoice added to the customer
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.post('/customers/:username/invoices', async (req, res) => {
  console.log(req.body); // Troubleshooting line... print the request body to the console. The correct data is sending.
  try {
    const customer = await Customer.findOne({ userName: req.params.username });
    if (!customer) {
      return res.status(404).send('User not found');
    }
    
    const newInvoice = {
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      dateCreated: req.body.dateCreated,
      dateShipped: req.body.dateShipped,
      lineItems: req.body.lineItems
    };
    
    customer.invoices.push(newInvoice);
    await customer.save();
    
    res.status(200).json({ message: 'Invoice added to the customer' });
  } catch (error) {
    console.error(error);
    res.status(error.name === 'MongoError' ? 501 : 500).send('Server Exception');
  }
});

// Find all invoices by username
/**
 * @openapi
 * /api/customers/{username}/invoices:
 *   get:
 *     summary: Get all invoices for a customer by username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the customer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of invoices returned successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.get('/customers/:username/invoices', async (req, res) => {
  try {
    const customer = await Customer.findOne({ userName: req.params.username });
    if (!customer) {
      return res.status(404).send('User not found');
    }
    // Successfully found and returning the invoices
    res.status(200).json(customer.invoices);
  } catch (error) {
    console.error(error);
    res.status(error.name === 'MongoError' ? 501 : 500).send('Server Exception');
  }
});

// Export the router
module.exports = router;
