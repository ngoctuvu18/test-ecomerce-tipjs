'use strict'
const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbit')

const consumerToQueue = async queueName => {
  try {
    const { channel, connection } = await connectToRabbitMQ()
    await consumerQueue(queueName, channel)
  } catch (error) {
    console.error('Error consumer Queue:', error)
  }
}
module.exports = { consumerToQueue }
