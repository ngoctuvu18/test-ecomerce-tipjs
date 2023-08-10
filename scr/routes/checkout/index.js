'use strict'

const express = require('express')
const checkoutController = require('../../controllers/checkout.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

//get amount a discount
router.post('/review', asyncHandler(checkoutController.checkoutReview))
// router.delete('', asyncHandler(checkoutController.deleteUserCart))
// router.post('/update', asyncHandler(checkoutController.updateToCart))
// router.get('', asyncHandler(checkoutController.getListUserCart))

//Authentication
router.use(authenticationV2)
/////////////////////

module.exports = router
