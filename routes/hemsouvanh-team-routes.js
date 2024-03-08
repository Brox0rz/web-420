/*
============================================
; Title:  hemsouvanh-team-routes.js
; Author: Brock Hemsouvanh
; Contributors: Professor Richard Krasso
; Date:   07 Mar 2024
; Description: Routes file for the team collection
;===========================================
*/


// Requirement statements
const express = require('express');
const router = express.Router();
const Team = require('../models/hemsouvanh-team');


// findAllTeams Operation
/**
 * @openapi
 * /api/teams:
 *   get:
 *     summary: Retrieves an array of all teams
 *     description: Query the team collection using the find() function on the Team model.
 *     responses:
 *       200:
 *         description: Array of team documents
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.get('/teams', async (req, res) => {
  try {
      const teams = await Team.find(); // Using the Team model to fetch all teams
      res.status(200).json(teams);
  } catch (error) {
      console.error(error);
      if (error instanceof mongoose.Error) {
          res.status(501).send('MongoDB Exception');
      } else {
          res.status(500).send('Server Exception');
      }
  }
});

/**
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     summary: Assigns a player to a team
 *     description: Adds a new player to the team's player array.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Player document
 *       401:
 *         description: Invalid teamID
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.post('/teams/:id/players', async (req, res) => {
  try {
      const team = await Team.findOne({ _id: req.params.id });
      
      if (team) {
          const player = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              salary: req.body.salary
          };
          team.players.push(player);
          await team.save();
          res.status(200).json(player);
      } else {
          res.status(401).send('Invalid teamID');
      }
  } catch (error) {
      console.error(error);
      if (error instanceof mongoose.Error) {
          res.status(501).send('MongoDB Exception');
      } else {
          res.status(500).send('Server Exception');
      }
  }
});

/**
 * @openapi
 * /api/teams:
 *   post:
 *     summary: Creates a new team
 *     description: Adds a new team to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mascot
 *             properties:
 *               name:
 *                 type: string
 *               mascot:
 *                 type: string
 *               players:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/playerSchema'
 *     responses:
 *       200:
 *         description: Team document created
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.post('/teams', async (req, res) => {
  try {
      let newTeam = new Team({
          name: req.body.name,
          mascot: req.body.mascot,
          players: req.body.players || [] // Default to an empty array if no players provided
      });
      
      await newTeam.save(); // Save the new team to the database
      res.status(200).json(newTeam); // Respond with the new team document
  } catch (error) {
      console.error(error);
      if (error instanceof mongoose.Error) {
          res.status(501).send('MongoDB Exception');
      } else {
          res.status(500).send('Server Exception');
      }
  }
});

/**
 * @openapi
 * /api/teams/{id}:
 *   get:
 *     summary: Retrieves an array of all players by team ID
 *     description: Query the team collection by team ID to return an array of player documents.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID to search for player documents
 *     responses:
 *       200:
 *         description: Array of player documents
 *       401:
 *         description: Invalid teamID
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.get('/teams/:id', async (req, res) => {
  try {
      const team = await Team.findById(req.params.id); // Using the Team model to fetch team by ID

      if (team) {
          res.status(200).json(team.players); // Respond with the array of player documents
      } else {
          res.status(401).send('Invalid teamID');
      }
  } catch (error) {
      console.error(error);
      if (error instanceof mongoose.Error) {
          res.status(501).send('MongoDB Exception');
      } else {
          res.status(500).send('Server Exception');
      }
  }
});

/**
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     summary: Deletes a team document by ID
 *     description: Delete the team document from the database using the deleteOne() function on the Team model.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID to be deleted
 *     responses:
 *       200:
 *         description: Team document deleted
 *       401:
 *         description: Invalid teamID
 *       500:
 *         description: Server Exception
 *       501:
 *         description: MongoDB Exception
 */
router.delete('/teams/:id', async (req, res) => {
  try {
      const teamId = req.params.id;
      const team = await Team.findById(teamId);

      if (team) {
          await team.remove();
          res.status(200).send(`Team with ID: ${teamId} deleted`);
      } else {
          res.status(401).send('Invalid teamID');
      }
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
