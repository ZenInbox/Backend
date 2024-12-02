const express = require("express")

const router = express.Router();

const {sendEmail , saveDraft ,  getSentEmails , getDrafts  ,scheduleEmail, getScheduledEmails, trackEmail} = require("../Controllers/EmailController")

router.post("/send-email" , sendEmail);
router.post('/save-draft', saveDraft);
router.get('/sent', getSentEmails);
router.get('/drafts', getDrafts);
router.post('/schedule-email', scheduleEmail);
router.get('/scheduled', getScheduledEmails);
router.get("/track" , trackEmail)

exports.router = router;