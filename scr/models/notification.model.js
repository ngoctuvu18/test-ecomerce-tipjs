'use strict'
const { Schema, model } = require('mongoose') //Erase if already require

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

//Declare the Schema of the Mongo model
const notificationSchema = new Schema(
  /*
    ORDER-001: order successfully
    ORDER-002: order failed
    PROMOTION-001: new promotion
    SHOP-001: new product by User Following       
   */
  {
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
    noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)
//export the model
module.exports = model(DOCUMENT_NAME, notificationSchema)
