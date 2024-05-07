import express from 'express'
import mongoose from 'mongoose'

const app = express()

mongoose.connect('mongodb://localhost:27017/dborders')
    .then(() => {
        console.log('Connected to Mongo')
    }).catch((err) => {
        console.log('Unable to Connect to Mongo')
    })

app.listen(3001, (err) =>{
    if(err)
        console.log('Unable to start server')
    else
        console.log('server started at 3000')
})

