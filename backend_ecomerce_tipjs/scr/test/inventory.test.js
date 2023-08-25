'use strict'
const RedisPubSubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
  constructor() {
    RedisPubSubService.subscribe('purchase_events', (channel, message) => {
      console.log('Received message::', message)
      InventoryServiceTest.updateInventory(message)
    })
  }
  static updateInventory({ productId, quantity }) {
    console.log(`[001]::Updated inventory for Product ID ${productId} with quantity ${quantity}`)
  }
}
module.exports = new InventoryServiceTest()
