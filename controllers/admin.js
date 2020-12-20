const bcrypt = require('bcryptjs')

const Author = require('../models/author')
const User = require('../models/user')
const Post = require('../models/post')

exports.addAuthor = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if (req.userType !== "admin") {
        const error = new Error('access denied')
        error.statusCode = 400
        throw error
    }

    Author.findOne({ email: email }).then(author => {
        if (author) {
            const error = new Error('this email exists')
            error.statusCode = 400
            throw error
            //    return res.status(500).json({
            //         "message":"use another email"
            //     })
        }
        bcrypt.hash(password, 12)
            .then(pass => {
                const author = new Author({
                    name: name,
                    email: email,
                    password: pass,
                })

                return author.save()
            })
            .then(savedAuthor => {
                res.status(201).json({
                    message: "author created",
                    author: savedAuthor
                })
            })
    })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.deleteAuthor = (req, res, next) => {
    if (req.userType !== "admin") {
        const error = new Error('access denied')
        error.statusCode = 400
        throw error
    }

    const authorId = req.params.authorId
    console.log(authorId)
    Author.findById(authorId).then(author => {
        if (!author) {
            const error = new Error('author not found')
            error.statusCode = 404
            throw error
        }
        return Author.findByIdAndDelete(authorId)
    })
        .then(result => {
            res.status(200).json({
                message: "auther deleted"
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}
exports.deleteUser = (req, res, next) => {
    if (req.userType !== "admin") {
        const error = new Error('access denied')
        error.statusCode = 400
        throw error
    }

    const userId = req.params.userId
    User.findById(userId).then(user => {
        if (!user) {
            const error = new Error('user not found')
            error.statusCode = 404
            throw error
        }
        return User.findByIdAndDelete(userId)
    })
        .then(result => {
            res.status(200).json({
                message: "user deleted"
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId

    if (req.userType !== "admin") {
        const error = new Error('access denied')
        error.statusCode = 400
        throw error
    }
    Post.findById(postId).then(post => {
        if (!post) {
            const error = new Error('post not found')
            error.statusCode = 404
            throw error
        }
        return Post.findByIdAndDelete(postId)
    }).then(result => {
        res.status(200).json({
            message: "post deleted"
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.editAuthor = (req, res, next) => {
    const authorId = req.params.authorId

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if (req.userType !== "admin") {
        const error = new Error('access denied')
        error.statusCode = 400
        throw error
    }

    Author.findById(authorId).then(author => {
        if (!author) {
            const error = new Error('auther not find')
            error.statusCode = 400
            throw error
        }
        bcrypt.hash(password, 12)
            .then(pass => {
                author.name = name
                author.email = email
                author.password = pass
                return author.save()
            }).then(savedAuther => {
                res.status(200).json({
                    message: "author editted",
                    auther: savedAuther
                })
            })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

}