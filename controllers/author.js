const { json } = require('body-parser')
const Post = require('../models/post')

exports.addPost = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const content = req.body.content
    const category = req.body.category
    if (req.userType !== "author") {
        const error = new Error("you not allow to create post")
        error.statusCode = 403
        throw error
    }
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        category: category,
        creator: req.userId
    })
    post.save().then(result => {
        res.status(201).json({
            message: "post created",
            post: result
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })


}
exports.editPost = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const content = req.body.content
    const category = req.body.category
    const postId = req.params.postId
    if (req.userType !== "author") {
        const error = new Error("you not allow to create post")
        error.statusCode = 403
        throw error
    }
    Post.findById(postId).then(post => {
        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error("you fuck of...can't edit")
            error.statusCode = 403
            throw error
        }
        post.title = title
        post.imageUrl = imageUrl
        post.content = content
        post.category = category
        return post.save()
    }).then(result => {
        res.status(201).json({
            message: "post editted",
            post: result
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.deletePost=(req,res,next)=>{
    const postId= req.params.postId
    Post.findById(postId).then(post=>{
        if (!post) {
            const error = new Error('post not found')
            error.statusCode = 404
            throw error
        }

        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error("you fuck of...can't delete")
            error.statusCode = 403
            throw error
        }
        return Post.findByIdAndDelete(postId)
    }).then(result=>{
        res.status(200).json({
            message: "post deleted"
        })
    }).catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })   
}