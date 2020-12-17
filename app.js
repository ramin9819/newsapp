const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')

const postRouter=require('./routes/posts')
const authRouter=require('./routes/auth')

const app=express()

// app.use(bodyParser.urlencoded({extended:false})); //for form 
app.use(bodyParser.json())



app.use(postRouter)
app.use('/auth',authRouter)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data= error.data

    res.status(status).json({ message: message, data: data })
})

mongoose.connect('mongodb://localhost/newsAPI').then(result=>{
    console.log('connected to database')
    app.listen(3000,()=>{
        console.log('listening to port 3000')
    })
}).catch(err=>{
    console.log(err)
})

