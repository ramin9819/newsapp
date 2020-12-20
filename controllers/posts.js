const Post=require('../models/post')
const Comment=require('../models/comment')

exports.getPosts=(req,res,next)=>{
    Post.find().sort({createdAt:-1}).then(posts=>{
        // console.log(posts)
        res.status(200).json({
            "message":"you are in index page",
            "posts":posts
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

}
exports.getPost=(req,res,next)=>{

    const postId=req.params.postId

    Post.findOne({_id:postId}).populate('creator').then(post=>{
        if(!post){
            const error=new Error('post not found')
            error.statusCode=404
            throw error
        }
        Comment.find({post:post}).then(comments=>{
            res.status(200).json({
                message: "here you go",
                post:post,
                comments:comments
            })
        })
        

    }).catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.addComment=(req,res,next)=>{
    const postId= req.params.postId
    const content =req.body.content

    const comment= new Comment({
        content :content,
        post: postId,
        creator:req.userId
    })
    comment.save().then(addedComment=>
        res.status(201).json({
            message:"comment added",
            comment:addedComment
        })
    ).catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

    
}