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
}
