const mongoose = require("mongoose")

const ScheduledEmailsSchema = new mongoose.Schema({
    emailId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Email', // Reference to the Emails collection
        required: true 
    },
    scheduledTime: { 
        type: Date, 
        required: true, // The time when the email is scheduled to be sent
    },
    status: { 
        type: String, 
        enum: ['pending', 'sent', 'failed'], 
        default: 'pending', // Status of the scheduled email
    },
})

const ScheduledEmails = mongoose.model('ScheduledEmails' , ScheduledEmailsSchema) ;
module.exports = ScheduledEmails ;