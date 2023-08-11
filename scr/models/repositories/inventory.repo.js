'use strict'
const { Types } = require('mongoose')
const { inventory } = require('../inventory.model')
const { convertToObjectIdMongodb } = require('../../utils')
const insertInventory = async ({ stock, productId, shopId, location = 'unKnow' }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  })
}
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inven_stock: -quantity },
      $push: { inven_reservations: { quantity, cartId, createOn: new Date() } },
    },
    options = { upsert: true, new: true }
  return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory,
}
