'use strict'

const CommentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Comment  success !!',
      metadata: await CommentService.createComment(req.body),
    }).send(res)
  }
  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Comment  success !!',
      metadata: await CommentService.deleteComment(req.body),
    }).send(res)
  }
  getCommentByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Comment By Parent Id  success !!',
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res)
  }
}

module.exports = new CommentController()
