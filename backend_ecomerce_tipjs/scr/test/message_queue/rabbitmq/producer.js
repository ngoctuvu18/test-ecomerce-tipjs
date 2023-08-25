const amqp = require('amqplib')
const message = 'Hello, RabbitMQ for Javascript !!!'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true,
    })
    //send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log(`message send: `, message)
  } catch (error) {
    console.error(error)
  }
}
runProducer().catch(console.error)
