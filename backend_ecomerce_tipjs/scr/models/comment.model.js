'use strict'
const { Schema, model } = require('mongoose') //Erase if already require

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

//Declare the Schema of the Mongo model
const commentSchema = new Schema(
  {
    comment_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDelete: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)
//export the model
module.exports = model(DOCUMENT_NAME, commentSchema)
