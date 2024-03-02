/*
============================================
; Title:  hemsouvanh-composer-routes.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso (https://github.com/buwebdev/web-420/blob/master/app.js)
; Date:   04 Feb 2024
; Description: Routes file for the composer app
;===========================================
*/

// Requirement statements
const express = require('express');
const Composer = require('../models/hemsouvanh-composer');

// Create an express router
const router = express.Router();

/**
 * findAllComposers
 * @openapi
 * /api/composers:
 *   get:
 *     tags:
 *       - Composers
 *     description: API for returning an array of composer objects.
 *     summary: returns an array of composers in JSON format.
 *     responses:
 *       '200':
 *         description: Array of composer documents.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get('/composers', async (req, res) => {
    try {
        const composers = await Composer.find({});
        res.json(composers);
    } catch (error) {
        console.log(error);
        if (error.name === "MongoServerError") {
            res.status(501).send({
                'message': `MongoDB Exception: ${error}`
            });
        } else {
            res.status(500).send({
                'message': `Server Exception: ${error.message}`
            });
        }
    }
});

/**
 * findComposerById
 * @openapi
 * /api/composers/{id}:
 *   get:
 *     tags:
 *       - Composers
 *     description: API for returning a single composer document.
 *     summary: returns a single composer in JSON format.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the composer to find.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get('/composers/:id', async (req, res) => {
    try {
        const composer = await Composer.findOne({ _id: req.params.id });
        if (composer) {
            res.json(composer);
        } else {
            res.status(404).send({
                'message': 'Composer not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': `Server Exception: ${error.message}`
        });
    }
});

/**
 * createComposer
 * @openapi
 * /api/composers:
 *   post:
 *     tags:
 *       - Composers
 *     description: API for adding a new composer object.
 *     summary: creates a new composer in the MongoDB database.
 *     requestBody:
 *       description: Composer information.
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Composer document.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.post('/composers', async (req, res) => {
    try {
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        Composer.create(newComposer, function (error, composer) {
            if (error) {
                console.log(error);
                res.status(501).send({
                    'message': `MongoDB Exception: ${error}`
                });
            } else {
                res.json(composer);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            'message': `Server Exception: ${error.message}`
        });
    }
});

/**
 * @openapi
 * /api/composers/{id}:
 *   put:
 *     tags:
 *       - Composers
 *     summary: Update a composer by their ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Composer updated successfully
 *       401:
 *         description: Invalid composerId
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */

router.put('/:id', async (req, res) => {
    try {
      const composer = await Composer.findOne({ _id: req.params.id });
      if (composer) {
        composer.set(req.body);
        await composer.save();
        res.status(200).json(composer);
      } else {
        res.status(401).send('Invalid composerId');
      }
    } catch (error) {
      console.error(error);
      if (error.name === 'MongoError') {
        res.status(501).send('MongoDB Exception');
      } else {
        res.status(500).send('Server Exception');
      }
    }
  });
  
  /**
   * @openapi
   * /api/composers/{id}:
   *   delete:
   *     tags:
   *       - Composers
   *     summary: Delete a composer by their ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Composer deleted successfully
   *       401:
   *         description: Invalid composerId
   *       500:
   *         description: Server Exception
   *       501:
   *         description: MongoDB Exception
   */
  router.delete('/:id', async (req, res) => {
    try {
      const composer = await Composer.findById(req.params.id);
      if (composer) {
        await composer.remove();
        res.status(200).send('Composer deleted successfully');
      } else {
        res.status(401).send('Invalid composerId');
      }
    } catch (error) {
      console.error(error);
      if (error.name === 'CastError') {
        res.status(401).send('Invalid composerId');
      } else {
        res.status(500).send('Server Exception');
      }
    }
  });

module.exports = router;
