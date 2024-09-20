const express = require('express')
const router = express.Router()

const { getMessage } = require('../controllers/messageController.js')
const { addMessage } = require('../controllers/messageController.js')

router.post('/get-message', getMessage)
router.post('/add-message', addMessage)



module.exports = router