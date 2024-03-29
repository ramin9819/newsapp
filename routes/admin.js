const express=require('express')

const adminController=require('../controllers/admin')

const isAuth=require('../middleware/isAuth')

const router=express.Router()

router.post('/index',isAuth,adminController.getIndex)

router.post('/add-author',isAuth,adminController.addAuthor)

router.put('/edit-author/:authorId',isAuth,adminController.editAuthor)

router.delete('/delete-author/:authorId',isAuth,adminController.deleteAuthor)

router.delete('/delete-user/:userId',isAuth,adminController.deleteUser)

router.delete('/delete-post/:postId',isAuth,adminController.deletePost)

router.delete('/delete-comment/:commentId',isAuth,adminController.deleteComment)

module.exports=router