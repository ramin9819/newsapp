const express = require('express')

const authorController=require('../controllers/author')
const isAuth=require('../middleware/isAuth')

const router = express.Router()

router.get('/profile',isAuth, authorController.getProfile) 

router.post('/edit-profile', isAuth, authorController.editProfile)

router.post('/user-profile/:userId',authorController.getUserProfile)

router.get('/follow-user/:userId',isAuth,authorController.getFollowUser)


module.exports = router