const express=require('express')

const postController=require('../controllers/posts')
const authorController=require('../controllers/author')
const isAuth=require('../middleware/isAuth')

const router=express.Router()

// router.get('/',isAuth,postController.getPosts)
router.get('/',postController.getPosts)

router.get('/post/:postId',postController.getPost)

router.post('/add-post',isAuth,authorController.addPost)

router.put('/edit-post/:postId',isAuth,authorController.editPost)

router.delete('/delete-post/:postId',isAuth,authorController.deletePost)

router.put('/post/add-comment/:postId',isAuth,postController.addComment)





module.exports=router