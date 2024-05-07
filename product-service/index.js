import express from 'express'
import productRoutes from './routes/product.js'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())

app.use('/products', productRoutes)

mongoose.connect(process.env.url_mongoose).then(() => {
    console.log('Connected to mongo')
}).catch((err) => {
    console.log('Unable to connect to Mongo')
})

app.listen(process.env.port, (err) => {
    if(!err)
        console.log('Server started at 3000')
    else
        console.log('Server started at 3000')
})