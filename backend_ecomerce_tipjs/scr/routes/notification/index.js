'use strict'

const express = require('express')
const NotificationController = require('../../controllers/notification.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// router.delete('', asyncHandler(checkoutController.deleteUserCart))
// router.post('/update', asyncHandler(checkoutController.updateToCart))
// router.get('', asyncHandler(checkoutController.getListUserCart))

//Authentication
router.use(authenticationV2)
/////////////////////
router.get('', asyncHandler(NotificationController.listNotiByUser))

module.exports = router
