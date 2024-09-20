const express = require('express')
const router = express.Router()
const { register, login,setAvatar,getAlluser } = require('../controllers/userController')


router.post("/register", register)
router.post("/login", login)
router.put('/setavatar/:id',setAvatar)
router.get('/all-user/:id',getAlluser)


module.exports = router