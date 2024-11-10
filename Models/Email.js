const mongoose = require("mongoose")

const EmailSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    recipients: [{
        type: String, // List of recipient email addresses
        required: true,
    }],
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    attachments: [{
        filename: String, // Name of the file
        filepath: String, // Path where the file is stored
    }],
    status: {
    type: String,
    enum: ['draft', 'sent', 'failed', 'scheduled'],
    default: 'draft',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    scheduledTime: Date,
})

const Email = mongoose.model('Email' , EmailSchema) ;
module.exports = Email ;