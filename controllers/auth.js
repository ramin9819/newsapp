const bcrypt = require('bcryptjs')

const Author = require('../models/author')
const Admin = require('../models/admin')
const User = require('../models/user')
const Post = require('../models/post')

exports.postSignup = (req, res, next) => {
    //TODO :   send email verification 
    // password hash
    const name = req.body.name
    const password = req.body.password
    const email = req.body.email
    const likedCategory = req.body.likedCategory
    console.log(likedCategory)

    User.findOne({ email: email }).then(user => {
        console.log(user)
        if (user) {
            const error = new Error('this email exists')
            error.statusCode = 200
            throw error
            //    return res.status(500).json({
            //         "message":"use another email"
            //     })
        }

    }).then(p => {
        bcrypt.hash(password, 12).then(pass => {
            const user = new User({
                name: name,
                email: email,
                password: pass,
                // likedCategory:likedCategory
            })

            return user.save()
        })
            .then(user => {
                for (let i in likedCategory) {
                    user.likedCategory.push(likedCategory[i])
                }
                user.save()
                res.status(201).json({
                    message: "user created"
                })
            }
            )
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

}
exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const userType = req.body.userType
    let loggedUser
    if (userType === "user") {
        console.log('user section')
        User.findOne({ email: email }).then(user => {
            if (!user) {
                const error = new Error('email or password in incorrect')
                error.statusCode = 404
                throw error
            }
            loggedUser = user
            return bcrypt.compare(password, user.password)
        }).then(result => {
            if (!result) {
                const error = new Error('email or password in incorrect')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: 'login accepted',
                user: {
                    name: loggedUser.name,
                    email: loggedUser.email,
                    userId: loggedUser._id,
                    likedCategory: loggedUser.likedCategory
                }
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
    } else if (userType === "author") {
        console.log('author section')
        Author.findOne({ email: email }).then(user => {
            if (!user) {
                const error = new Error('email or password in incorrect')
                error.statusCode = 404
                throw error
            }
            loggedUser = user
            return bcrypt.compare(password, user.password)
        }).then(result => {
            if (!result) {
                const error = new Error('email or password in incorrect')
                error.statusCode = 404
                throw error
            }
            Post.find({ creator: loggedUser._id }).then(autherPosts => {
                console.log("postss:", autherPosts)
                res.status(200).json({
                    message: 'login accepted',
                    user: {
                        name: loggedUser.name,
                        email: loggedUser.email,
                        userId: loggedUser._id,
                        posts: autherPosts
                    }
                })
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
    } else if (userType === "admin") {
        console.log('admin section')
        Admin.findOne({ email: email }).then(user => {
            if (!user) {
                const error = new Error('email or password in incorrect')
                error.statusCode = 404
                throw error
            }
            loggedUser = user
            return bcrypt.compare(password, user.password)
        }).then(result => {
            if (!result) {
                const error = new Error('email or password in incorrect')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: 'login accepted',
                user: {
                    name: loggedUser.name,
                    email: loggedUser.email,
                    userId: loggedUser._id
                }
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
    }


}