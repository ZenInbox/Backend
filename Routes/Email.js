const express = require("express")

const router = express.Router();

const {sendEmail , saveDraft ,  getSentEmails , getDrafts  ,scheduleEmail, getScheduledEmails, trackEmail, sendDraft} = require("../Controllers/EmailController")

router.post("/send-email" , sendEmail);
router.post('/sent', getSentEmails);
router.post('/save-draft', saveDraft);
router.post('/send-draft', sendDraft);
router.post('/drafts', getDrafts);
router.post('/schedule-email', scheduleEmail);
router.get('/scheduled', getScheduledEmails);
router.get("/track" , trackEmail)

exports.router = router;