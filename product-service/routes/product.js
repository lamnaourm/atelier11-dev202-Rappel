import express from 'express'
import amqp from 'amqplib'
import pModel from '../models/Product.js'

const routes = express.Router()

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
})

routes.post('/', (req, res) => {
    const produit = req.body

    pModel.create(produit)
     .then((p) => {
        res.json(p)
     })
     .catch((err) => {
        res.status(520).send(err)
     })
})

routes.post('/buy', (req, res) => {
    const ids = req.body

    pModel.find({_id:{$in:ids}})
        .then((produits) => {
            channel.sendToQueue(q1, Buffer.from(JSON.stringify(produits)))
            
            channel.consume(q2, (data) => {
                const order = JSON.parse(data.content.toString())

                return res.json(order);
            })
        })
        .catch((err) => {
            return res.status(520).send(err)
         })
})

export default routes