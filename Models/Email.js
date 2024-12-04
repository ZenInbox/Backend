const mongoose = require("mongoose")

const EmailSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    recipients: [{ 
        type: String,
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
        type: String,
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