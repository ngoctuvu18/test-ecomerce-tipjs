'use strict'

const { model, Schema, Types } = require('mongoose') //Erase if already require
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

//Declare the Schema of the Mongo model

const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verfify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)
//export the model
module.exports = model(DOCUMENT_NAME, shopSchema)
