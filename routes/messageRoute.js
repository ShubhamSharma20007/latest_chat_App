const express = require('express')
const router = express.Router()

const { getMessage } = require('../controllers/messageController')
const { addMessage } = require('../controllers/messageController')

router.post('/get-message', getMessage)
router.post('/add-message', addMessage)



module.exports = router