'use strict'
const amqp = require('amqplib')
const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    if (!connection) throw new Error(`Connection not established !!`)
    const channel = await connection.createChannel()
    return { channel, connection }
  } catch (error) {
    console.error(`Error connecting to RabbitMQ: `, error)
    throw error
  }
}

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ()
    //Publish message to a queue
    const queue = 'test-queue'
    const message = 'Hello, shopDEV !!'
    await channel.assertQueue(queue)
    await channel.sendToQueue(queue, Buffer.from(message))
    // Close the connection
    await connection.close()
  } catch (error) {
    console.error(`Error connecting to RabbitMQ: `, error)
  }
}

const consumerQueue = async queueName => {
  const { channel, connection } = await connectToRabbitMQ()
  try {
    await channel.assertQueue(queueName, { durable: true })
    console.log(`Waiting for message ...`)
    channel.consume(
      queueName,
      msg => {
        console.log(`Received message: ${queueName}:: `, msg.content.toString())
        //1. find user following shop
        //2. send message to user
        //3. yes, ok => success
        //4. error => setup DLX ...
      },
      {
        noAck: true,
      },
    )
  } catch (error) {
    console.error(`error publish message to rabbitMq: `, error)
    throw error
  }
}

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
}
