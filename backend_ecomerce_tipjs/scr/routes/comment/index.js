'use strict'

const express = require('express')
const CommentController = require('../../controllers/comment.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// router.delete('', asyncHandler(checkoutController.deleteUserCart))
// router.post('/update', asyncHandler(checkoutController.updateToCart))
// router.get('', asyncHandler(checkoutController.getListUserCart))

//Authentication
router.use(authenticationV2)
/////////////////////
router.post('', asyncHandler(CommentController.createComment))
router.delete('', asyncHandler(CommentController.deleteComment))
router.get('', asyncHandler(CommentController.getCommentByParentId))
module.exports = router
