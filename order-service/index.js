import express from 'express'
import amqp from 'amqplib'
import mongoose from 'mongoose'
import orderSchema from './models/Order.js'

const app = express()

mongoose.connect(process.env.url_mongoose)
    .then(() => {
        console.log('Connected to Mongo')
    }).catch((err) => {
        console.log('Unable to Connect to Mongo')
    })

var connection, channel;
const q1 = process.env.q1
const q2 = process.env.q2

const connectRabbitMQ = async () => {
    const ch = process.env.url_rabbit
    connection = await amqp.connect(ch)
    channel = await connection.createChannel()
    channel.assertQueue(q1)
    channel.assertQueue(q2)
}

connectRabbitMQ().then(() => {
    console.log('Connected to rabbit')

    channel.consume(q1, (data) => {
        const produits = JSON.parse(data.content.toString())
        const total = produits.reduce((som, p) => som + p.price, 0)

        const order = { produits, total }
        orderSchema.create(order).then(() => {
            console.log('Order cree')

            channel.sendToQueue(q2, Buffer.from(JSON.stringify(order)))
        })
            .catch((err) => {
                console.log('Erreur')
            })

    })
})

app.listen(process.env.port, (err) => {
    if (err)
        console.log('Unable to start server')
    else
        console.log('server started at 3000')
})

