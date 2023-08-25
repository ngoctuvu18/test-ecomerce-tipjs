'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

//get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

//Authentication
router.use(authenticationV2)
/////////////////////
router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router
