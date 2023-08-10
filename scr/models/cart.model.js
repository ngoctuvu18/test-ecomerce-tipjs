'use strict'

const { model, Schema } = require('mongoose') //Erase if already require
const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

//Declare the Schema of the Mongo model
const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ['active', 'pending', 'completed', 'failed'],
      required: true,
      default: 'active',
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
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
module.exports = { cart: model(DOCUMENT_NAME, cartSchema) }
