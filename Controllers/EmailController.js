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
  
      const newEmail = new Email({
        sender: senderUser._id,
        recipients,
        subject,
        body,
        attachments,
        status: 'sent',
      });
      await newEmail.save();
  
      res.status(200).json({ 
        message: 'Email sent successfully', 
        email: newEmail, 
        emailInfo: result.data 
      });
  
    } catch (error) {
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

exports.getSentEmails = async (req, res) => {
  try {
    const { senderEmail } = req.body;
    const senderUser = await User.findOne({ email: senderEmail });
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender not found in database' });
    }
    const sentEmails = await Email.find({ sender: senderUser._id, status: 'sent' });
    res.status(200).json(sentEmails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sent emails', error });
  }
};

exports.getDrafts = async (req, res) => {
  try {
    const { senderEmail } = req.body;
    const senderUser = await User.findOne({ email: senderEmail });
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender not found in database' });
    }
    const drafts = await Email.find({ sender: senderUser._id, status: 'draft' });
    res.status(200).json(drafts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drafts', error });
  }
};

exports.scheduleEmail = async (req, res) => {
  try {
      const { sender, recipients, subject, body, attachments, scheduledTime } = req.body;

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];  // Example: "2024-12-03"
      
      const time12Hour = scheduledTime;  
      let hours = parseInt(time12Hour.slice(0, time12Hour.indexOf(':')));  
      const minutes = time12Hour.slice(time12Hour.indexOf(':') + 1, time12Hour.indexOf(':') + 3);  
      const ampm = time12Hour.slice(-2); 
      
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const scheduledDateTime = `${formattedDate}T${hours.toString().padStart(2, '0')}:${minutes}:00`;

      const parsedScheduledTime = new Date(scheduledDateTime);

      if (isNaN(parsedScheduledTime.getTime())) {
          return res.status(400).json({ message: 'Invalid time format. Please use a valid time.' });
      }

      const senderUser = await User.findOne({ email: sender });
      if (!senderUser) {
          return res.status(404).json({ message: 'Sender not found in database' });
      }

      const newEmail = new Email({
          sender: senderUser._id,
          recipients,
          subject,
          body,
          attachments,
          status: 'scheduled',  
      });
      const savedEmail = await newEmail.save();

      const newScheduledEmail = new ScheduledEmails({
          emailId: savedEmail._id,
          scheduledTime: parsedScheduledTime, 
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
              match: { sender: senderUser._id }, 
              select: 'recipients subject body scheduledTime status', 
          });

      const filteredScheduledEmails = scheduledEmails.filter(email => email.emailId !== null);

      res.status(200).json(filteredScheduledEmails);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching scheduled emails', error });
  }
};

