'use strict'
const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { findProduct } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

class CommentService {
  //Create Comment
  static async createComment({ productId, userId, content, parentCommentId = null }) {
    const comment = await Comment.create({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    })
    let rightValue
    if (parentCommentId) {
      //reply comment
      const parentComment = await Comment.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError('parent Comment not found')
      rightValue = parentComment.comment_right
      //updateMany comment
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        },
      )
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: {
            comment_left: 2,
          },
        },
      )
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        'comment_right',
        { sort: { comment_right: -1 } },
      )
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }
    console.log(`rightValue::`, rightValue)
    //insert to comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1
    await comment.save()
    return comment
  }

  //Get list Comment
  static async getCommentByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId)
      if (!parent) throw new NotFoundError('parent Comment not found')
      const comments = Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_content: 1,
          comment_left: 1,
          comment_right: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })
      return comments
    }
    const comments = Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_content: 1,
        comment_left: 1,
        comment_right: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 })
    return comments
  }

  //Delete Comment
  static async deleteComment({ commentId, productId }) {
    //check the product exits in the database
    const foundProduct = await findProduct({
      product_id: productId,
    })
    if (!foundProduct) throw new NotFoundError('product not found')
    //xac dinh gia tri left and right of CommentId
    const comment = await Comment.findById(commentId)
    if (!comment) throw new NotFoundError('comment not found')
    const rightValue = comment.comment_right
    const leftValue = comment.comment_left
    // tinh width
    const width = rightValue - leftValue + 1
    // xoa tat ca comment con
    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    })
    // cap nhat lai gia tri left right con lai
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      },
    )
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      },
    )
    return true
  }
}

module.exports = CommentService
