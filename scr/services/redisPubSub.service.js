'use strict'
const redis = require('redis')

// const redisPassword = '8TNArV5M4FHTDhNhJ7jEjDpKVbSyhDQh'
// const client = redis.createClient({
//   host: '127.0.0.1',
//   no_ready_check: true,
//   auth_pass: redisPassword,
// })

// client.on('connect', () => {
//   global.console.log('connected')
// })

// client.on('error', err => {
//   global.console.log(err.message)
// })
class RedisPubSubService {
  constructor() {
    this.publisher = redis.createClient()
    this.subscriber = redis.createClient()
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err)
        } else {
          resolve(reply)
        }
      })
    })
  }
  subscribe(channel, callback) {
    this.subscriber.subscribe(channel)
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message)
      }
    })
  }
}
module.exports = new RedisPubSubService()
