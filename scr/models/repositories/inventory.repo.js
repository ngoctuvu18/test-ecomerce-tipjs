'use strict'
const { Types } = require('mongoose')
const { inventory } = require('../inventory.model')
const insertInventory = async ({ stock, productId, shopId, location = 'unKnow' }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  })
}
module.exports = {
  insertInventory,
}
