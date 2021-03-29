const express=require('express')
const mongoose=require('mongoose')
// const bodyParser=require('body-parser')

const postRouter=require('./routes/posts')
const authRouter=require('./routes/auth')
const adminRouter=require('./routes/admin')
const userRouter=require('./routes/user')

const app=express()


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
})

app.use(postRouter)
app.use(userRouter)
app.use('/auth',authRouter)
app.use('/admin',adminRouter)
console.log('cors')


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

