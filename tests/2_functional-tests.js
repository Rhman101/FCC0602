/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	suite('POST /api/issues/{project} => object with issue data', function() {
		test('Every field filled in', function(done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.savedIssue.issue_title, 'Title');
					done();
				});
		});

		test('Required fields filled in', function(done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in'
				})
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.savedIssue.issue_title, 'Title');
					assert.isDefined(res.body.savedIssue.created_on);
					done();
				});
		});

		test('Missing required fields', function(done) {
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					created_by: 'Functional Test - Every field filled in'
				})
				.end(function(err, res) {
					assert.equal(res.body.errors.issue_text.message, 'Path `issue_text` is required.');
					done();
				});
		});
	});

	suite('PUT /api/issues/{project} => text', function() {
		test('No body', function(done) {
			let id = '';
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function(err, res) {
					id = res.body.savedIssue._id;
					chai.request(server)
						.put('/api/issues/test')
						.send({
							_id: id
						})
						.end((err, res) => {
							assert.equal(res.body.message, 'no updated fields sent');
							done();
						});
				});
		});

		test('One field to update', function(done) {
			let id = '';
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function(err, res) {
					id = res.body.savedIssue._id;
					chai.request(server)
						.put('/api/issues/test')
						.send({
							_id: id,
							issue_title: 'TitleB'
						})
						.end((err, res) => {
							let x = res.body.message;
							let text = 'successfully updated';
							assert.equal(x, text);
							done();
						});
				});
		});

		test('Multiple fields to update', function(done) {
			let id = '';
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function(err, res) {
					id = res.body.savedIssue._id;
					chai.request(server)
						.put('/api/issues/test')
						.send({
							_id: id,
							issue_title: 'TitleB',
							issue_text: 'textb',
							open: false
						})
						.end((err, res) => {
							let x = res.body.message;
							let text = 'successfully updated';
							assert.equal(x, text);
							done();
						});
				});
		});
	});

	suite('GET /api/issues/{project} => Array of objects with issue data', function() {
		test('No filter', function(done) {
			chai.request(server)
				.get('/api/issues/test')
				.query()
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isArray(res.body);
					assert.property(res.body[0], 'issue_title');
					assert.property(res.body[0], 'issue_text');
					assert.property(res.body[0], 'created_on');
					assert.property(res.body[0], 'updated_on');
					assert.property(res.body[0], 'created_by');
					assert.property(res.body[0], 'assigned_to');
					assert.property(res.body[0], 'open');
					assert.property(res.body[0], 'status_text');
					assert.property(res.body[0], '_id');
					done();
				});
		});

		test('One filter', function(done) {
			chai.request(server)
				.get('/api/issues/test')
				.query({ open: true })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isArray(res.body);
					assert.property(res.body[0], 'issue_title');
					assert.property(res.body[0], 'issue_text');
					assert.property(res.body[0], 'created_on');
					assert.property(res.body[0], 'updated_on');
					assert.property(res.body[0], 'created_by');
					assert.property(res.body[0], 'assigned_to');
					assert.property(res.body[0], 'open');
					assert.property(res.body[0], 'status_text');
					assert.property(res.body[0], '_id');
					done();
				});
		});

		test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
			chai.request(server)
				.get('/api/issues/test')
				.query({
					open: true,
					assigned_to: 'Chai and Mocha'
				})
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isArray(res.body);
					assert.property(res.body[0], 'issue_title');
					assert.property(res.body[0], 'issue_text');
					assert.property(res.body[0], 'created_on');
					assert.property(res.body[0], 'updated_on');
					assert.property(res.body[0], 'created_by');
					assert.property(res.body[0], 'assigned_to');
					assert.property(res.body[0], 'open');
					assert.property(res.body[0], 'status_text');
					assert.property(res.body[0], '_id');
					done();
				});
		});
	});

	suite('DELETE /api/issues/{project} => text', function() {
		test('No _id', function(done) {
			chai.request(server)
				.delete('/api/issues/test')
				.send()
				.end((err, res) => {
					let x = res.body.message;
					let y = '_id error';
					assert.equal(x, y);
					done();
				});
		});

		test('Valid _id', function(done) {
			let x = '';
			chai.request(server)
				.post('/api/issues/test')
				.send({
					issue_title: 'Title',
					issue_text: 'text',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Chai and Mocha',
					status_text: 'In QA'
				})
				.end(function(err, res) {
					x = res.body.savedIssue._id;
					console.log(x);
					chai.request(server)
						.delete('/api/issues/test')
						.send({
							_id: x
						})
						.end(function(err, res) {
							assert.equal(res.body.message, `deleted ${x}`);
							done();
						});
				});
		});
	});
});
