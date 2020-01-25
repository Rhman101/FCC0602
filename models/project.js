const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    issue_title: {
        type: String, 
        required: true,
        unique: true
    },
    issue_text: {
        type: String
    },
    created_by: {
        type: String,
        required: true,
    },
    assigned_to: {
        type: String
    },
    status_text: {
        type: String
    },
    created_on: {
        type: Date,
        required: true
    },
    updated_on: {
        type: Date,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    }
})

const Issue = new mongoose.model('Issue', issueSchema);

module.exports = Issue;