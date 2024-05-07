import express from 'express'
import productRoutes from './routes/product.js'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())

app.use('/products', productRoutes)

mongoose.connect('mongodb://localhost:27017/dbproducts').then(() => {
    console.log('Connected to mongo')
}).catch((err) => {
    console.log('Unable to connect to Mongo')
})

app.listen(3000, (err) => {
    if(!err)
        console.log('Server started at 3000')
    else
        console.log('Server started at 3000')
})