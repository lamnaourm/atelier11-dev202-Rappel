import express from 'express'
import amqp from 'amqplib'
import nodemailer from 'nodemailer'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express()

var connection, channel;
const q3 = process.env.q3

const connectRabbitMQ = async () => {
    const ch = process.env.url_rabbit
    connection = await amqp.connect(ch)
    channel = await connection.createChannel()
    channel.assertQueue(q3)
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohammed.lamnaour@gmail.com',
      pass: 'flwhnokdmozxtwoh'
    }
  });
  
  
connectRabbitMQ().then(() => {
    console.log('Connected to rabbit')

    channel.consume(q3, (data) => {
        var mailOptions = {
            from: 'mohammed.lamnaour@gmail.com',
            to: 'mohammed.lamnaour@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!' + data.content.toString()
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
    })
})

app.listen(process.env.port, (err) => {
    if(err)
        console.log('Unable to start server')
    else 
        console.log('Server started')
        
})