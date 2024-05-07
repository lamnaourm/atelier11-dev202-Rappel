import express from 'express'

const app = express()


app.listen(3002, (err) => {
    if(err)
        console.log('Unable to start server')
    else 
        console.log('Server started')
        
})