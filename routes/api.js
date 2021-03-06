/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const Issue = require('./../models/project');

module.exports = function(app) {
	app.route('/api/issues/:projectName')

		.get(async (req, res) => {
			const projectName = req.params.projectName;
			let filterObject = { projectName };
			if (req.query) {
				let queriesArray = Object.keys(req.query);
				queriesArray.forEach((key) => {
					filterObject[key] = req.query[key];
				});
			}
			let issues = await Issue.find(filterObject);
			res.json(issues);
		})

		.post(async (req, res) => {
			let time = new Date();
			try {
				const issue = new Issue({
					...req.body,
					...req.params,
					created_on: time,
					updated_on: time,
					open: true
				});
				let savedIssue = await issue.save();
				res.json({ savedIssue });
			} catch (e) {
				res.json(e);
			}
		})

		.put(async (req, res) => {
			console.log('ID supplied', req.body._id);
			let issue = await Issue.findById(req.body._id);
			if (issue === null) {
				return res.json({
					message: 'Did not indicate ID'
				});
			}
			const editable = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
			if (Object.keys(req.body).length < 2) {
				return res.json({
					message: 'no updated fields sent'
				});
			}
			editable.forEach((elem) => {
				if (req.body[elem]) {
					issue[elem] = req.body[elem];
				}
			});
			issue.updated_on = new Date();
			try {
				await issue.save();
				res.json({
					message: 'successfully updated'
				});
			} catch (e) {
				res.json({
					message: `could not update ${req.body._id}`
				});
			}
		})

		.delete(async (req, res) => {
			if (!req.body._id) {
				return res.json({
					message: '_id error'
				});
			}
			try {
				let deleted = await Issue.findByIdAndRemove(req.body._id);
				if (deleted.toObject()._id.toString() === req.body._id) {
					console.log('FIRING!!!');
					return res.json({
						message: `deleted ${deleted.toObject()._id.toString()}`
					});
				} else {
					console.log('what the heck else?');
				}
			} catch (e) {
				res.json({ message: `could not delete ${req.body._id}` });
			}
		});
};
