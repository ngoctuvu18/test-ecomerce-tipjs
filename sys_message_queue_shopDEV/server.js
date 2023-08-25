'use strict'
const { consumerToQueue } = require('./src/services/consumerQueue.service')
const queueName = 'test-topic'
consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer start: ${queueName} `)
  })
  .catch(err => {
    console.error(`Message consumer error: ${err.message} `)
  })
