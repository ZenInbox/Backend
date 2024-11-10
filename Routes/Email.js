const express = require("express")

const router = express.Router();

const {sendEmail , saveDraft ,  getSentEmails , getDrafts  ,scheduleEmail, getScheduledEmails} = require("../Controllers/EmailController")

router.post("/send-email" , sendEmail);
router.post('/save-draft', saveDraft);
router.get('/emails/sent', getSentEmails);
router.get('/emails/drafts', getDrafts);
router.post('/schedule-email', scheduleEmail);
router.get('/emails/scheduled', getScheduledEmails);

exports.router = router;