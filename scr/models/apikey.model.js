'use strict'

const { model, Schema, Types } = require('mongoose') //Erase if already require
const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

//Declare the Schema of the Mongo model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      emun: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)
//export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema)
