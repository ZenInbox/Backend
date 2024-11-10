const User = require("../Models/User")
const ScheduledEmails = require('../Models/ScheduledEmails');
const Email = require('../Models/Email');
const { google } = require("googleapis");

exports.sendEmail = async (req, res) => {
    try {
      const { sender, recipients, subject, body, attachments, accessToken, refreshToken } = req.body;
  
      const senderUser = await User.findOne({ email: sender });
  
      if (!senderUser) {
        return res.status(404).json({ message: 'Sender not found in database' });
      }
  
      // Initializing the Gmail API client
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID, process.env.CLIENT_SECRET
      );

      oauth2Client.setCredentials({ access_token: accessToken });
  
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
      // Format email content as base64 encoded message
      const emailContent = [
        `From: ${senderUser.email}`,
        `To: ${recipients.join(',')}`,
        `Subject: ${subject}`,
        '',
        body,
      ].join('\n');
  
      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  
      // Sending the email using the Gmail API
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
  
      // saving email details in your database
      const newEmail = new Email({
        sender: senderUser._id,
        recipients,
        subject,
        body,
        attachments,
        status: 'sent',
      });
      await newEmail.save();
  
      // Respond with success and Gmail API result
      res.status(200).json({ 
        message: 'Email sent successfully', 
        email: newEmail, 
        emailInfo: result.data 
      });
      console.log("sent")
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending email', error: error.message });
    }
  };
  

exports.saveDraft = async(req,res) =>{
    try {
        const { sender, recipients, subject, body, attachments } = req.body;
        const senderUser = await User.findOne({ email: sender });
        if (!senderUser) {
          return res.status(404).json({ message: 'Sender not found in database' });
        }
        const newEmail = new Email({
            sender:senderUser._id,
            recipients,
            subject,
            body,
            attachments,
            status: 'draft',
        });
        await newEmail.save();
        res.status(200).json({ message: 'Draft saved successfully', email: newEmail });
    } catch (error) {
        res.status(500).json({ message: 'Error saving draft', error });
    }
}

exports.getSentEmails = async(req,res) =>{
    try {
        const {senderEmail} = req.body;
        const sentEmails = await Email.find({ email: senderEmail, status: 'sent' });
        res.status(200).json(sentEmails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sent emails', error });
    }
}

exports.getDrafts = async(req,res) =>{
    try {
      const {senderEmail} = req.body;
        const drafts = await Email.find({ semail: senderEmail, status: 'draft' });
        res.status(200).json(drafts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching drafts', error });
    }
}

exports.scheduleEmail = async (req, res) => {
  try {
      const { sender, recipients, subject, body, attachments, scheduledTime } = req.body;

      const senderUser = await User.findOne({ email: sender });
      if (!senderUser) {
        return res.status(404).json({ message: 'Sender not found in database' });
      }
  
      const newEmail = new Email({
          sender:senderUser._id,
          recipients,
          subject,
          body,
          attachments,
          status: 'pending', 
      });
      const savedEmail = await newEmail.save();

      const newScheduledEmail = new ScheduledEmails({
          emailId: savedEmail._id,
          scheduledTime,
          status: 'pending',
      });
      await newScheduledEmail.save();

      res.status(200).json({ 
          message: 'Email scheduled successfully', 
          email: savedEmail, 
          scheduledEmail: newScheduledEmail 
      });
  } catch (error) {
      res.status(500).json({ message: 'Error scheduling email', error });
  }
};

exports.getScheduledEmails = async (req, res) => {
  try {
      const { senderEmail } = req.body; 
      
      const senderUser = await User.findOne({ email: senderEmail });
      if (!senderUser) {
          return res.status(404).json({ message: 'Sender not found in database' });
      }

      const scheduledEmails = await ScheduledEmails.find({ status: 'pending' })
          .populate({
              path: 'emailId',
              match: { sender: senderUser._id }, // Filter for emails sent by this user
              select: 'recipients subject body scheduledTime status', // Select fields you want to return
          });

      const filteredScheduledEmails = scheduledEmails.filter(email => email.emailId !== null);

      res.status(200).json(filteredScheduledEmails);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching scheduled emails', error });
  }
};

