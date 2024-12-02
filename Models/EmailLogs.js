const mongoose = require("mongoose")

const EmailLogsSchema = new mongoose.Schema({
    emailId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Email', 
        required: true 
    },
    recipient: { 
        type: String, 
        required: true   
    },
    status: { 
        type: String, 
        enum: ['delivered', 'opened'], 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now, 
    },
})

const EmailLogs = mongoose.model('EmailLogs' , EmailLogsSchema) ;
module.exports = EmailLogs ;