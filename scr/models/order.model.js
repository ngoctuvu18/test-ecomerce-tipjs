'use strict'

const { model, Schema } = require('mongoose') //Erase if already require
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

//Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    /*
        street, country, city, state
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#000008102023' },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn',
    },
    collection: COLLECTION_NAME,
  },
)
//export the model
module.exports = { cart: model(DOCUMENT_NAME, orderSchema) }
