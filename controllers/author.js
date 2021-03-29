const { json } = require("body-parser");
const Post = require("../models/post");
const User = require("../models/user");

exports.addPost = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const content = req.body.content;
  const category = req.body.category;

  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    category: category,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "post created",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.editPost = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const content = req.body.content;
  const category = req.body.category;
  const postId = req.params.postId;
  if (req.userType !== "author") {
    const error = new Error("you not allow to create post");
    error.statusCode = 403;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error("you fuck of...can't edit");
        error.statusCode = 403;
        throw error;
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      post.category = category;
      return post.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "post editted",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("post not found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error("you fuck of...can't delete");
        error.statusCode = 403;
        throw error;
      }
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "post deleted",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProfile = (req, res, next) => {
  const userId = req.userId;
  let user = {};
  User.findById(userId)
    .then((usr) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
      }
      user = usr;
      Post.find()
        .sort({ createdAt: -1 })
        .then((posts) => {
          const userposts = posts.filter((post) => post.creator == userId);
          console.log(posts);
          console.log(userposts);

          return userposts;
        })
        .then((userposts) => {
          res.status(200).json({
            message: "you are in profile page",
            posts: userposts,
            user: user,
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editProfile = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const likedCategory = req.body.likedCategory;
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
      }
      user.name = name;
      user.email = email;
      user.likedCategory = likedCategory;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "editted", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserProfile = (req, res, next) => {
  const userId = req.params.userId;
  const mainUserId =req.body.userId
  let user = {};
  let isFollowed=false
  User.findById(userId)
    .then((usr) => {
      if (!usr) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
      }
      if(usr.followers.includes(mainUserId)){
        isFollowed=true
      }
      user = usr;
      const followers=usr.followers.length
      Post.find()
        .sort({ createdAt: -1 })
        .then((posts) => {
          const userposts = posts.filter((post) => post.creator == userId);
          console.log(posts);
          console.log(userposts);

          return userposts;
        })
        .then((userposts) => {
          res.status(200).json({
            message: "you are in user profile page",
            posts: userposts,
            user: user,
            isFollowed:isFollowed,
            followers:followers
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.getFollowUser=(req,res,next)=>{
  const userId=req.userId
  const followUserId=req.params.userId
  User.findById(userId).then(user=>{
    if(user.followings.includes(followUserId)){
      User.findById(followUserId).then(followUser=>{
        if (!followUser) {
          const error = new Error("user not found");
          error.statusCode = 404;
          throw error;
        }
        followUser.followers=followUser.followers.filter((usr)=> usr !=userId)
        followUser.save()
      })
      user.followings=user.followings.filter((usr)=> usr != followUserId)
      user.save().then(response=>{
        console.log(response)
        res.status(200).json({
          message: "unfollowed",
          isFollowed:false
        });
      })
    }else{
      User.findById(followUserId).then(followUser=>{
        if (!followUser) {
          const error = new Error("user not found");
          error.statusCode = 404;
          throw error;
        }
        followUser.followers.push(userId)
        followUser.save()
      })
      user.followings.push(followUserId)
      user.save().then(response=>{
        console.log(response)
        res.status(200).json({
          message: "followed",
          isFollowed:true
        });
      })
    }
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}
