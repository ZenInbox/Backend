const mongoose = require("mongoose")

const IncomingEmailsSchema = new mongoose.Schema({
    from: { 
        type: String, 
        required: true, // Sender's email address
    },
    subject: { 
        type: String, 
        required: true, // Subject of the email
    },
    body: { 
        type: String, 
        required: true, // Body of the email
    },
    attachments: [{
        filename: { 
            type: String, 
            required: true, // Filename of the attachment
        },
        filepath: { 
            type: String, 
            required: true, // Path to where the file is stored
        }
    }],
    receivedAt: { 
        type: Date, 
        default: Date.now, // Date when the email was received
    },
    status: { 
        type: String, 
        enum: ['new', 'replied', 'ignored'], 
        default: 'new', // Status of the email
    },
})

const IncomingEmails = mongoose.model('IncomingEmails' , IncomingEmailsSchema) ;
module.exports = IncomingEmails ;