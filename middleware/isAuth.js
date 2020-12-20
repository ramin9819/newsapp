const jsonwt =require('jsonwebtoken')

module.exports=(req,res,next)=>{
    const authHeader=req.get('Authorization')
    if (!authHeader){
        const error= new Error('user not authenticated')
        error.statusCode=401
        throw error
    }
    const token = authHeader.split(' ')[1]
    let encodedUser
    try{
        encodedUser=jsonwt.verify(token,'privatekey')
    }
    catch(err){
        err.statusCode=500
        throw err
    }
    if (!encodedUser){
        const error= new Error('the user not authenticated')
       error.statusCode=401
        throw error
    }
    // console.log(encodedUser)
    req.userId=encodedUser.userId
    req.userType=encodedUser.userType
    next()
}