import express from 'express'

const app = express()

// loading middleware into app

// inbuilt middleware - it can parse the data 
app.use(express.json())

// custom middleware - logging , auth , validation 

const loggingMiddleware = (req , res , next) => {
    console.log('LOGGING IN');
    next();
}
const authMiddleware = (req , res , next) => {
    console.log('Autherizarion ')
    next()
}
const validationMiddleware = (req , res , next) => {
    console.log('Validation Done')
}

app.get('/' , (req , res) => {
    console.log(req.body)
    res.send('Hello world')
})